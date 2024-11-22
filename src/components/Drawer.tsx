import './styles/drawer.css'
import Drawer from '@corvu/drawer'
import type { VoidComponent } from 'solid-js'
import { createSignal, onMount, For } from 'solid-js'
import { createPasswordEntry, getAllPasswordEntries, deletePasswordEntry, type PasswordEntry } from './surrealdb'

const DrawerComponent: VoidComponent = () => {
  const [entries, setEntries] = createSignal<PasswordEntry[]>([])
  const [newTitle, setNewTitle] = createSignal('')
  const [newPassword, setPassword] = createSignal('')

  onMount(async () => {
    const passwordEntries = await getAllPasswordEntries()
    setEntries(passwordEntries ?? [])
  })

  const handleAddEntry = async () => {
    if (!newTitle() || !newPassword()) {
      alert('Please fill in both title and username')
      return
    }
    await createPasswordEntry(newTitle(), newPassword())
    setNewTitle('')
    setPassword('')
    const passwordEntries = await getAllPasswordEntries()
    setEntries(passwordEntries ?? [])
  }

  const handleDeleteEntry = async (id: string) => {
    await deletePasswordEntry(id)
    const passwordEntries = await getAllPasswordEntries()
    setEntries(passwordEntries ?? [])
  }

  return (
    <Drawer breakPoints={[0.75]}>
      {(props) => (
        <>
          <Drawer.Trigger> ⋯ </Drawer.Trigger>
          {/* ⋯ 🞢 🞡 */}
          <Drawer.Portal>
            <Drawer.Overlay
              style={{
                'background-color': `rgb(0 0 0 / ${
                  0.5 * props.openPercentage
                })`,
              }}
            />
            <Drawer.Content>
              <div class="notch" />
              <Drawer.Close> 
              <svg style="opacity:20%" width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2Zm3.53 6.47-.084-.073a.75.75 0 0 0-.882-.007l-.094.08L12 10.939l-2.47-2.47-.084-.072a.75.75 0 0 0-.882-.007l-.094.08-.073.084a.75.75 0 0 0-.007.882l.08.094L10.939 12l-2.47 2.47-.072.084a.75.75 0 0 0-.007.882l.08.094.084.073a.75.75 0 0 0 .882.007l.094-.08L12 13.061l2.47 2.47.084.072a.75.75 0 0 0 .882.007l.094-.08.073-.084a.75.75 0 0 0 .007-.882l-.08-.094L13.061 12l2.47-2.47.072-.084a.75.75 0 0 0 .007-.882l-.08-.094-.084-.073.084.073Z" fill="#ffffff"/></svg>
              </Drawer.Close>         
                <Drawer.Label>Password Entries</Drawer.Label>
                
                <div class="input-group">
                  <input
                    type="text"
                    placeholder="Enter title"
                    value={newTitle()}
                    onInput={(e) => setNewTitle(e.currentTarget.value)}
                  />
                  <input
                    type="text"
                    placeholder="Enter username"
                    value={newPassword()}
                    onInput={(e) => setPassword(e.currentTarget.value)}
                  />
                  <button 
                    onClick={handleAddEntry}
                    disabled={!newTitle() || !newPassword()}
                  >
                    Add Entry
                  </button>
                </div>
                
                <div class="entries-list">
                  <For each={[...entries()].reverse()} >
                    {(entry) => (
                      <div  class="entry-item">
                        <div>
                        <p class="hint">{entry.title}</p>
                        <p>{entry.password}</p>
                        </div>
                        <button 
                          class="delete-button"
                          onClick={() => handleDeleteEntry(entry.id.id)}
                        >
                          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21.5 6a1 1 0 0 1-.883.993L20.5 7h-.845l-1.231 12.52A2.75 2.75 0 0 1 15.687 22H8.313a2.75 2.75 0 0 1-2.737-2.48L4.345 7H3.5a1 1 0 0 1 0-2h5a3.5 3.5 0 1 1 7 0h5a1 1 0 0 1 1 1Zm-7.25 3.25a.75.75 0 0 0-.743.648L13.5 10v7l.007.102a.75.75 0 0 0 1.486 0L15 17v-7l-.007-.102a.75.75 0 0 0-.743-.648Zm-4.5 0a.75.75 0 0 0-.743.648L9 10v7l.007.102a.75.75 0 0 0 1.486 0L10.5 17v-7l-.007-.102a.75.75 0 0 0-.743-.648ZM12 3.5A1.5 1.5 0 0 0 10.5 5h3A1.5 1.5 0 0 0 12 3.5Z" fill="#ffffff"/></svg>
                        </button>
                      </div>
                    )}
                  </For>
                </div>
              <Drawer.Description>Drag down to close me.</Drawer.Description>
            </Drawer.Content>
          </Drawer.Portal>
        </>
      )}
    </Drawer>
  )
}

export default DrawerComponent