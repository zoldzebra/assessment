import Ajv, { JSONSchemaType, Plugin } from 'ajv';
import range from 'ajv-keywords';

import { NewTodo } from './todo';

const ajv = new Ajv();
range(ajv);

const newTodoJsonSchema: JSONSchemaType<NewTodo> = {
  type: "object",
  properties: {
    text: { type: "string" },
    priority: { type: "integer", range: [1, 5], nullable: true },
    done: { type: "boolean", nullable: true },
  },
  required: ["text"],
  additionalProperties: false
};


export const isNewTodoValid = ajv.compile(newTodoJsonSchema);
