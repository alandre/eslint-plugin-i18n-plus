const fs = require('fs');
const path = require('path');

const isNullish = value => typeof value === 'undefined' || value === null;

const getBy = (object, path) => {
    return path.split('.').reduce((acc, key) => (isNullish(acc) ? acc : acc[key]), object);
};

const findNearestPath = (fileName, pathToTranslations) => {
    let basePath = path.join(fileName, '..');
    while (true) {
        if (fs.existsSync(path.join(basePath, pathToTranslations))) {
            return basePath;
        }
        const newPath = path.join(basePath, '..');
        if (newPath === basePath) {
            return false;
        }

        basePath = newPath;
    }
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
            accessor: accessorString = 'jsonContent => jsonContent',
        } = context.options[0] || {};

        if (!files.length) {
            return;
        }

        const basePath = findNearestPath(context.getFilename(), files[0]);
        if (!basePath) {
            throw new Error(`Cannot resolve path ${files[0]}.`);
        }

        const accessor = eval(accessorString);

        const locales = files.map(file => ({
            fileName: path.basename(file),
            translation: accessor(JSON.parse(fs.readFileSync(path.join(basePath, file)).toString())),
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
};
