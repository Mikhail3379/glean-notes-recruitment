interface Note {
  id: number;
  timestamp: number;
  text: string;
}

interface Lecture {
  name: string;
  notes: Note[];
}
// Function to resolve conflicts between two lectures.
function resolveLectures(remote: Lecture, local: Lecture): Lecture {
  const resolvedNotes: Note[] = [];
  const localNotesById = new Map(local.notes.map(note => [note.id, note]));
  const remoteNotesById = new Map(remote.notes.map(note => [note.id, note]));
// Iterate over notes in local lecture.
  for (let [id, localNote] of localNotesById) {
    const remoteNote = remoteNotesById.get(id);
    if (remoteNote) {
      // Notes with the same ID exist in both lectures, need to resolve conflicts.
      resolvedNotes.push({
        id,
        timestamp: remoteNote.timestamp,
        text: `${localNote.text} / ${remoteNote.text}`,
      });
    } else {
      // Only exists in local lecture.
      resolvedNotes.push(localNote);
    }
  }

  // Add notes that only exist in the remote lecture.
  for (const [id, remoteNote] of remoteNotesById) {
    if (!localNotesById.has(id)) {
      resolvedNotes.push(remoteNote);
    }
  }

  return {
    name: `${local.name} / ${remote.name}`,
    notes: resolvedNotes,
  };
}

// Unit tests
const localLecture: Lecture = {
  name: "Name 1",
  notes: [
    { id: 1, timestamp: 3200, text: "A" },
    { id: 2, timestamp: 5600, text: "C" },
  ],
};

const remoteLecture: Lecture = {
  name: "Name 2",
  notes: [{ id: 1, timestamp: 2400, text: "B" }],
};

const resolvedLecture = resolveLectures(remoteLecture, localLecture);

console.assert(
  resolvedLecture.name === "Name 1 / Name 2",
  `Expected 'Name 1 / Name 2', but got '${resolvedLecture.name}'`
);

console.assert(
  resolvedLecture.notes.length === 2,
  `Expected 2 notes, but got ${resolvedLecture.notes.length}`
);

const note1 = resolvedLecture.notes[0];
console.assert(
  note1.id === 1,
  `Expected note with ID 1, but got note with ID ${note1.id}`
);
console.assert(
  note1.timestamp === 2400,
  `Expected note with timestamp 2400, but got ${note1.timestamp}`
);
console.assert(
  note1.text === "A / B",
  `Expected note with text 'A / B', but got '${note1.text}'`
);

const note2 = resolvedLecture.notes[1];
console.assert(
  note2.id === 2,
  `Expected note with ID 2, but got note with ID ${note2.id}`
);
console.assert(
  note2.timestamp === 5600,
  `Expected note with timestamp 5600, but got ${note2.timestamp}`
);
console.assert(
  note2.text === "C",
  `Expected note with text 'C', but got '${note2.text}'`
);