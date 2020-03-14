const fs = require('fs');
const path = require('path');

const isNullish = value => typeof value === 'undefined' || value === null;

const getBy = (object, path) => {
    return path.split('.').reduce((acc, key) => (isNullish(acc) ? acc : acc[key]), object);
};

/**
 * @fileoverview All the used i18n keys should be defined in translation files
 * @author Alexey
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    rules: {
        'no-undefined-keys': {
            meta: {
                type: 'problem',
                schema: [
                    {
                        properties: {
                            translations: {
                                type: 'array',
                                description: 'Array of paths to translation files',
                                minItems: 1,
                                items: {
                                    type: 'string',
                                    minLength: 1,
                                },
                            },
                            accessor: {
                                type: 'string',
                                description: 'Function that accesses the translation object',
                            },
                        },
                    },
                ],
            },
            create: context => {
                const {
                    translations: files = [],
                    accessor: accessorString = 'object => Object.values(object)[0].translation',
                } = context.options[0] || {};

                const accessor = eval(accessorString);

                const locales = files.map(file => ({
                    fileName: path.basename(file),
                    translation: accessor(JSON.parse(fs.readFileSync(file).toString())),
                }));

                return {
                    'CallExpression[callee.name="t"] > Literal'(node) {
                        locales.forEach(({ fileName, translation }) => {
                            if (typeof getBy(translation, node.value) === 'undefined') {
                                context.report({
                                    node,
                                    message: 'Translation key {{ key }} is missing in {{ translationFileName }}',
                                    data: {
                                        key: node.raw,
                                        translationFileName: fileName,
                                    },
                                });
                            }
                        });
                    },
                };
            },
        },
    },
};
