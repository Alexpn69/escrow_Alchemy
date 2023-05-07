import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

export const useStore = create(
  devtools(
    persist(
      (set) => ({
        count: 1,
        inc: () => set((state) => ({ count: state.count + 1 })),
      }),
      { getStorage: () => localStorage }
    )
  )
);

// export const useTodos = create(
//   devtools((set) => ({
//     todos: [],
//     loading: false,
//     error: null,
//     // addTodo: (title) => set(state => {
//     //   const newTodo = { id: nanoid(), title, completed: false }

//     //   return { todos: [...state.todos, newTodo] }
//     // })
//     addTodo: (title) =>
//       set((state) => ({
//         todos: [...state.todos, { title, completed: false }],
//       })),
//     // addTodo: (title) => {
//     //   const newTodo = { id: nanoid(), title, completed: false }

//     //   set({ todos: [...get().todos, newTodo] })
//     // },
//     // toggleTodo: (todoId) => set({
//     //   todos: get().todos.map(
//     //     todo => todoId === todo.id
//     //       ? { ...todo, completed: !todo.completed }
//     //       : todo
//     //   )
//     // }),
//     // fetchTodos: async () => {
//     //   set({ loading: true })

//     //   try {
//     //     const res = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=10')

//     //     if (!res.ok) throw new Error('Failed to fetch! Try again.')

//     //     set({ todos: await res.json(), error: null })
//     //   } catch (error) {
//     //     set({ error: error.message })
//     //   } finally {
//     //     set({ loading: false })
//     //   }
//     // }
//   }))
// );
