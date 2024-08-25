import chalk from 'chalk';
import fs from 'fs';
import { Command } from "commander";

const program = new Command();

// Function to read todos from the JSON file
function read() {
  const data = fs.readFileSync("todos.json", "utf-8");
  return JSON.parse(data);
}

// Function to write todos to the JSON file
function write(todos) {
  fs.writeFileSync("todos.json", JSON.stringify(todos, null, 2), "utf-8");
}

// Function to display all todos
function showTodo() {
  const todos = read();
  if (todos.length === 0) {
    console.log(chalk.yellow("No todos found. Add some tasks!"));
    return;
  }

  const headers = [
    chalk.bold.hex("#3a7007")("NO."),
    chalk.bold.hex("#3a7007")("TASK"),
    chalk.bold.hex("#3a7007")("TIME"),
    chalk.bold.hex("#3a7007")("STATUS"),
  ];
  const colWidths = [10,20,20,20]; // Set the column widths

  // Print the header row
  console.log(headers.join(' | '));

  // Print a separator row
  console.log(colWidths.map(width => '-'.repeat(width)).join('-|-'));

  // Print each todo item as a row in the table
  todos.forEach((todo, index) => {
    const row = [
      chalk.blue((index + 1).toString()), // Task number
      todo.task,                          // Task description
      todo.taskTime,                      // Task time
      todo.done ? chalk.green.bold("✓ Completed") : chalk.yellow.bold("⧖ Pending"), // Task status
    ];
    console.log(row.join(' | ')); // Print the row
  });

  // Display the total number of tasks
  console.log(chalk.dim(`Total tasks: ${todos.length}`));
}

// Function to add a new todo
function addTodo(taskName, taskTime) {
  const todos = read();
  const todo_obj = {
    task: taskName,
    taskTime: taskTime,
    done: false,
  };
  todos.push(todo_obj);
  write(todos);
  console.log(chalk.green(`Added task: ${taskName} at ${taskTime}`));
}

// Function to update the status of a todo
function updateTodo(tableNum) {
  const todos = read();
  const index = parseInt(tableNum) - 1;
  if (index >= 0 && index < todos.length) {
    todos[index].done = !todos[index].done;
    write(todos);
    const status = todos[index].done ? "✓ Completed" : "⧖ Pending";
    console.log(chalk.red.bold(`Updated Todo #${index + 1} status to: `) + chalk.cyan.underline(status));
  } else {
    console.log(chalk.red("Invalid input."));
  }
}

// Function to delete a todo
function deleteTodo(tableNum) {
  const todos = read();
  const index = parseInt(tableNum) - 1;
  if (index >= 0 && index < todos.length) {
    const [deleted_obj] = todos.splice(index, 1);
    write(todos);
    console.log(chalk.red.bold("Removed Todo: ") + chalk.cyan.underline(deleted_obj.task));
  } else {
    console.log(chalk.red("Invalid input."));
  }
}
// Function to Delete the entire list of todos
function deleteAllTodos() {
  const todos = [];
  write(todos); // Write an empty array to the file
  console.log(chalk.red.bold("All tasks have been deleted."));
}

// Set up the Commander program
program
  .name("todo")
  .description("CLI to show, add, update and delete todos")
  .version("0.0.0");

program
  .command("todo")
  .description("Manage your todos")
  .option('-a, --add <taskName> <taskTime>', 'Add a task to the list')
  .option('-s, --show', 'Show all tasks')
  .option('-u, --update <tableNum>', 'Mark a task as done/undone')
  .option('-d, --delete <tableNum>', 'Delete a task')
  .option('-dA, --deleteAll', 'Delete the entire list')
  .action((options) => {
    if (options.add) {
      const [taskName, taskTime] = options.add.split(',');  // Split the taskName and taskTime
      addTodo(taskName.trim(), taskTime.trim());  
    } else if (options.show) {
      showTodo();  
    } else if (options.update) {
      updateTodo(options.update);  
    } else if (options.delete) {
      deleteTodo(options.delete);  
    }else if (options.deleteAll) {
      deleteAllTodos();  // Handle deleting all tasks
    }else {
      console.log(chalk.red("No valid option provided."));  // Error message for no valid option
    }
  });

// Parse the command-line arguments
program.parse(process.argv);
