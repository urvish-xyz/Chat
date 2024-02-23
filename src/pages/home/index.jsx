import React, { Component, createRef } from 'react';
// import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from '@/components/ui/alert-dialog';
import SendIcon from '../../assets/send.svg';
import BinIcon from '../../assets/bin.svg';

export default class Home extends Component {
  state = {
    filterType: 'all',
    todoList: [],
  };

  inputRef = createRef();

  async componentDidMount() {
    this.loadTodo(); // Call it immediately when the component mounts
    this.interval = setInterval(this.loadTodo, 5000); // Call it every 5 seconds
  }

  componentWillUnmount() {
    clearInterval(this.interval); // Clear the interval when the component unmounts
  }

  loadTodo = async () => {
    try {
      const res = await fetch('http://localhost:3000/todoList');
      const json = await res.json();
      this.setState({ todoList: json });
    } catch (error) {
      // console.log('error on ', error);
    }
  };

  addTodo = async e => {
    try {
      e.preventDefault();
      const input = this.inputRef.current;

      const res = await fetch('http://localhost:3000/todoList', {
        method: 'POST',
        body: JSON.stringify({
          text: input.value,
          isDone: false,
        }),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      const json = await res.json();

      this.setState(
        ({ todoList }) => ({
          todoList: [...todoList, json],
        }),
        () => {
          input.value = '';
        },
      );
    } catch (error) {
      // alert('error on ', error);
    }
  };

  toggleComplete = async item => {
    try {
      const res = await fetch(`http://localhost:3000/todoList${item.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...item,
          isDone: !item.isDone,
        }),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      const json = await res.json();

      this.setState(({ todoList }) => {
        const index = todoList.findIndex(x => x.id === item.id);
        return {
          todoList: [
            ...todoList.slice(0, index),
            json,
            ...todoList.slice(index + 1),
          ],
        };
      });
    } catch (error) {
      // console.log(error);
    }
  };

  deleteTodo = async item => {
    try {
      await fetch(`http://localhost:3000/todoList${item.id}`, {
        method: 'DELETE',
      });

      this.setState(({ todoList }) => {
        const index = todoList.findIndex(x => x.id === item.id);
        return {
          todoList: [...todoList.slice(0, index), ...todoList.slice(index + 1)],
        };
      });
    } catch (error) {
      // console.log(error);
    }
  };

  // changeFilterType = filterType => {
  //   this.setState({ filterType });
  // };

  render() {
    // console.log('render');
    const { todoList, filterType } = this.state;

    return (
      <div className="relative flex flex-col items-center min-h-screen gap-4">
        <h1>Todo App</h1>

        <div className="flex flex-col flex-1 w-full gap-6 p-6">
          {todoList.map(item => {
            if (
              filterType === 'all' ||
              (filterType === 'pending' && item.isDone === false) ||
              (filterType === 'completed' && item.isDone === true)
            ) {
              return (
                <div key={item.id} className="flex items-center">
                  {/* <Checkbox
                    checked={item.isDone}
                    onCheckedChange={() => this.toggleComplete(item)}
                  /> */}
                  <p
                    className={`px-4 ${item.isDone === true && 'line-through'}`}
                  >
                    {item.text}
                  </p>
                  {/* <AlertDialog>
                    <AlertDialogTrigger asChild>
                    
                      <Button>Delete</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you sure you want to delete?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete ?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => this.deleteTodo(item)}
                        >
                          Confirm
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog> */}
                  <BinIcon height={15} onClick={() => this.deleteTodo(item)} />
                </div>
              );
            }
            return null;
          })}
        </div>
        <form
          onSubmit={this.addTodo}
          className="flex items-center w-full max-w-sm mb-5"
        >
          <Input
            className="rounded-full rounded-r-none"
            ref={this.inputRef}
            // value={todoText}
            // onChange={this.changeText}
            required
          />

          <button
            type="submit"
            className="p-2 bg-green-500 rounded-full rounded-l-none"
          >
            {/* Button */}
            <SendIcon width={24} />
          </button>
        </form>
        {/* <div className="absolute bottom-0 flex w-full">
          <Button
          className="flex-1 rounded-none"
          variant={filterType === 'all' ? 'destructive' : 'default'}
          onClick={() => this.changeFilterType('all')}
          >
          All
          </Button>
          <Button
          className="flex-1 rounded-none"
          variant={filterType === 'pending' ? 'destructive' : 'default'}
          onClick={() => this.changeFilterType('pending')}
          >
          Pending
          </Button>
          <Button
          className="flex-1 rounded-none"
          variant={filterType === 'completed' ? 'destructive' : 'default'}
          onClick={() => this.changeFilterType('completed')}
          >
          Completed
          </Button>
        </div> */}
      </div>
    );
  }
}
