import Ajv, { JSONSchemaType, Plugin } from 'ajv';
import range from 'ajv-keywords';

import { NewTodo, UpdateTodo } from './todo';

const ajv = new Ajv();
range(ajv);

const newTodoJsonSchema: JSONSchemaType<NewTodo> = {
  type: "object",
  properties: {
    text: { type: "string" },
    priority: { type: "integer", range: [1, 5], nullable: true },
    done: { type: "boolean", nullable: true },
  },
  additionalProperties: false,
  required: ["text"],
};

const updateTodoJsonSchema: JSONSchemaType<UpdateTodo> = {
  type: "object",
  properties: {
    text: { type: "string", nullable: true },
    priority: { type: "integer", range: [1, 5], nullable: true },
    done: { type: "boolean", nullable: true },
  },
  additionalProperties: false,
  required: [],
};

export const isNewTodoValid = ajv.compile(newTodoJsonSchema);
export const isUpdateTodoValid = ajv.compile(updateTodoJsonSchema);
