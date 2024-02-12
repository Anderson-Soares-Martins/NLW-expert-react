import { useState } from "react";
import logo from "./assets/logo-nlw-expert.svg";
import { NewNoteCard } from "./components/new-note-card";
import { NoteCard } from "./components/note-card";

interface Note {
  id: string;
  date: Date;
  content: string;
}

export function App() {
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState<Note[]>(() => {
    const notesOnStorage = localStorage.getItem("notes");

    if (notesOnStorage) {
      return JSON.parse(notesOnStorage);
    }

    return [];
  });

  function onCreatedNote(content: string) {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    };

    const newNotes = [newNote, ...notes];

    setNotes(newNotes);

    localStorage.setItem("notes", JSON.stringify(newNotes));
  }

  function onNoteDeleted(id: string) {
    const newNotes = notes.filter((note) => note.id !== id);

    setNotes(newNotes);

    localStorage.setItem("notes", JSON.stringify(newNotes));
  }

  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    const query = event.target.value;

    setSearch(query);
  }

  const filteredNotes =
    search !== ""
      ? notes.filter((note) =>
          note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        )
      : notes;

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5">
      <img src={logo} alt="NLW Expert" />

      <form className="w-full">
        <input
          type="text"
          placeholder="Busque suas notas aqui..."
          className="w-full bg-transparent text-3xl font-semibold outline-none tracking-tight placeholder:text-slate-500"
          value={search}
          onChange={handleSearch}
        />
      </form>

      <div className="h-px bg-slate-800" />

      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 auto-rows-[250px]">
        <NewNoteCard onCreatedNote={onCreatedNote} />
        {filteredNotes.map((note) => (
          <NoteCard key={note.id} note={note} onNoteDeleted={onNoteDeleted} />
        ))}
      </div>
    </div>
  );
}
