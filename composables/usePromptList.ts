import { usePromptListStore } from '../stores/promptList'

export function usePromptList() {
  const promptListStore = usePromptListStore()

  // Example fetch function
  async function fetchPromptList() {
    // You can call your store action here, or fetch data as needed
    // For example, if you have an action in your store:
    // return await promptListStore.addToPromptList({ ...payload })
    return promptListStore.prompts
  }

  return { fetchPromptList }
}