import { DateParser } from '../util/DateParser';
import { TodoItem, TodoItemStatus } from '../model/TodoItem';

export class TodoParser {
  private dateParser: DateParser;

  constructor(dateParser: DateParser) {
    this.dateParser = dateParser;
  }

  async parseTasks(filePath: string, fileContents: string): Promise<TodoItem[]> {
    const pattern = /(-|\*) \[(\s|x)?\]\s(.*)/g;
    return [...fileContents.matchAll(pattern)].map((task) => this.parseTask(filePath, task));
  }

  private parseTask(filePath: string, entry: RegExpMatchArray): TodoItem {
    const todoItemOffset = 2; // Strip off `-|* `
    const status = entry[2] === 'x' ? TodoItemStatus.Done : TodoItemStatus.Todo;
    const description = entry[3];

    const actionDate = this.dateParser.parseDate(description);
    const descriptionWithoutDate = this.dateParser.removeDate(description);
    const somedayPattern = /#(someday)/g;

    return new TodoItem(
      status,
      descriptionWithoutDate,
      description.match(somedayPattern) != null,
      filePath,
      (entry.index ?? 0) + todoItemOffset,
      entry[0].length - todoItemOffset,
      actionDate,
    );
  }
}
