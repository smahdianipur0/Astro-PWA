import './styles/drawer.css'
import Drawer from '@corvu/drawer'
import type { VoidComponent } from 'solid-js'
import { createSignal, onMount, For } from 'solid-js'
import { createPasswordEntry, getAllPasswordEntries, deletePasswordEntry, type PasswordEntry } from './surrealdb'

const DrawerComponent: VoidComponent = () => {
  const [entries, setEntries] = createSignal<PasswordEntry[]>([])
  const [newTitle, setNewTitle] = createSignal('')
  const [newUsername, setNewUsername] = createSignal('')

  onMount(async () => {
    const passwordEntries = await getAllPasswordEntries()
    setEntries(passwordEntries ?? [])
  })

  const handleAddEntry = async () => {
    if (!newTitle() || !newUsername()) {
      alert('Please fill in both title and username')
      return
    }
    await createPasswordEntry(newTitle(), newUsername())
    // Clear the inputs after adding
    setNewTitle('')
    setNewUsername('')
    // Refresh the list
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
          <Drawer.Trigger>Open</Drawer.Trigger>
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
              <div id="drawer_content">
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
                    value={newUsername()}
                    onInput={(e) => setNewUsername(e.currentTarget.value)}
                  />
                  <button 
                    id="add_db_button" 
                    onClick={handleAddEntry}
                    disabled={!newTitle() || !newUsername()}
                  >
                    Add Entry
                  </button>
                </div>
                
                <div class="entries-list">
                  <For each={[...entries()].reverse()}>
                    {(entry) => (
                      <div class="entry-item">
                        <p>Title: {entry.title}</p>
                        <p>Username: {entry.username}</p>
                        <button 
                          class="delete-button"
                          onClick={() => handleDeleteEntry(entry.id.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </For>
                </div>
              </div>
              <Drawer.Description>Drag down to close me.</Drawer.Description>
              <p class="hidden_frog">🐸 You found froggy!</p>
            </Drawer.Content>
          </Drawer.Portal>
        </>
      )}
    </Drawer>
  )
}

export default DrawerComponent