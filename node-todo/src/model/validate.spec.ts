import { isNewTodoValid, isUpdateTodoValid } from './validate';

describe('JSON Validation', () => {
  describe('isNewTodoValid', () => {
    it('should accept new todo with all fields', () => {
      const newTodo = {
        'text': 'New TODO',
        'priority': 3,
        'done': false
      }
      
      expect(isNewTodoValid(newTodo)).toBe(true);
    });

    it('should accept new todo with text only', () => {
      const newTodo = {
        'text': 'New TODO',
      }
      
      expect(isNewTodoValid(newTodo)).toBe(true);
    });
    
    it('should accept new todo with text + priority', () => {
      const newTodo = {
        'text': 'New TODO',
        'priority': 3
      }
      
      expect(isNewTodoValid(newTodo)).toBe(true);
    });

    it('should accept new todo with text + done', () => {
      const newTodo = {
        'text': 'New TODO',
        'done': false
      }
      
      expect(isNewTodoValid(newTodo)).toBe(true);
    });

    it('should not accept invalid text type', () => {
      const newTodo1 = {
        'text': 123,
      }
      const newTodo2 = {
        'text': false,
      }

      expect(isNewTodoValid(newTodo1)).toBe(false);
      expect(isNewTodoValid(newTodo2)).toBe(false);
    });

    it('should not accept invalid priority type', () => {
      const newTodo1 = {
        'text': 'New TODO',
        'priority': 'string'
      }
      const newTodo2 = {
        'text': 'New TODO',
        'priority': false
      }
      
      expect(isNewTodoValid(newTodo1)).toBe(false);
      expect(isNewTodoValid(newTodo2)).toBe(false);
    });

    it('should not accept invalid done type', () => {
      const newTodo1 = {
        'text': 'New TODO',
        'done': 'string'
      }
      const newTodo2 = {
        'text': 'New TODO',
        'done': 123
      }
      
      expect(isNewTodoValid(newTodo1)).toBe(false);
      expect(isNewTodoValid(newTodo2)).toBe(false);
    });

    it('should not accept additional properties', () => {
      const newTodo = {
        'text': 'New TODO',
        'dummy': 'dummy'
      }
      
      expect(isNewTodoValid(newTodo)).toBe(false);
    });

    it('should accept valid priority values', () => {
      const newTodo1 = {
        'text': 'New TODO',
        'priority': 1
      }
      const newTodo2 = {
        'text': 'New TODO',
        'priority': 2
      }
      const newTodo3 = {
        'text': 'New TODO',
        'priority': 3
      }
      const newTodo4 = {
        'text': 'New TODO',
        'priority': 4
      }
      const newTodo5 = {
        'text': 'New TODO',
        'priority': 5
      }
      
      expect(isNewTodoValid(newTodo1)).toBe(true);
      expect(isNewTodoValid(newTodo2)).toBe(true);
      expect(isNewTodoValid(newTodo3)).toBe(true);
      expect(isNewTodoValid(newTodo4)).toBe(true);
      expect(isNewTodoValid(newTodo5)).toBe(true);

    });

    it('should not accept invalid priority value', () => {
      const newTodo1 = {
        'text': 'New TODO',
        'priority': 3.5
      }
      const newTodo2 = {
        'text': 'New TODO',
        'priority': 0
      }
      const newTodo3 = {
        'text': 'New TODO',
        'priority': 6
      }
      
      expect(isNewTodoValid(newTodo1)).toBe(false);
      expect(isNewTodoValid(newTodo2)).toBe(false);
      expect(isNewTodoValid(newTodo3)).toBe(false);
    });
  });

  describe('isUpdateTodoValid', () => {
    it('should accept done and priority properties by themselves', () => {
      const updateTodo1 = {
        'done': false
      };
      const updateTodo2 = {
        'priority': 2
      };
      
      expect(isUpdateTodoValid(updateTodo1)).toBe(true);
      expect(isUpdateTodoValid(updateTodo2)).toBe(true);
    });
  })
});