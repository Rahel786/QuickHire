import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const StudyNotes = ({ notes, onAddNote, onEditNote, onDeleteNote, onSearchNotes }) => {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    topic: '',
    tags: ''
  });

  const handleAddNote = () => {
    if (newNote?.title?.trim() && newNote?.content?.trim()) {
      onAddNote({
        ...newNote,
        tags: newNote?.tags?.split(',')?.map(tag => tag?.trim())?.filter(tag => tag),
        createdAt: new Date()?.toISOString(),
        updatedAt: new Date()?.toISOString()
      });
      setNewNote({ title: '', content: '', topic: '', tags: '' });
      setIsAddingNote(false);
    }
  };

  const handleEditNote = (note) => {
    setEditingNote(note?.id);
    setNewNote({
      title: note?.title,
      content: note?.content,
      topic: note?.topic,
      tags: note?.tags?.join(', ')
    });
  };

  const handleSaveEdit = () => {
    if (newNote?.title?.trim() && newNote?.content?.trim()) {
      onEditNote(editingNote, {
        ...newNote,
        tags: newNote?.tags?.split(',')?.map(tag => tag?.trim())?.filter(tag => tag),
        updatedAt: new Date()?.toISOString()
      });
      setEditingNote(null);
      setNewNote({ title: '', content: '', topic: '', tags: '' });
    }
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    setIsAddingNote(false);
    setNewNote({ title: '', content: '', topic: '', tags: '' });
  };

  const filteredNotes = notes?.filter(note =>
    note?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    note?.content?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    note?.tags?.some(tag => tag?.toLowerCase()?.includes(searchQuery?.toLowerCase()))
  );

  return (
    <div className="bg-card border border-border rounded-lg shadow-card">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Study Notes</h2>
          <Button
            variant="default"
            size="sm"
            iconName="Plus"
            iconPosition="left"
            onClick={() => setIsAddingNote(true)}
          >
            Add Note
          </Button>
        </div>
        
        {/* Search Notes */}
        <div className="relative">
          <Input
            type="search"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            className="pl-10"
          />
          <Icon 
            name="Search" 
            size={18} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
          />
        </div>
      </div>
      {/* Add/Edit Note Form */}
      {(isAddingNote || editingNote) && (
        <div className="p-6 border-b border-border bg-muted/30">
          <div className="space-y-4">
            <Input
              label="Note Title"
              type="text"
              placeholder="Enter note title..."
              value={newNote?.title}
              onChange={(e) => setNewNote({ ...newNote, title: e?.target?.value })}
              required
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Topic"
                type="text"
                placeholder="e.g., Data Structures"
                value={newNote?.topic}
                onChange={(e) => setNewNote({ ...newNote, topic: e?.target?.value })}
              />
              <Input
                label="Tags"
                type="text"
                placeholder="e.g., arrays, sorting, algorithms"
                value={newNote?.tags}
                onChange={(e) => setNewNote({ ...newNote, tags: e?.target?.value })}
                description="Separate tags with commas"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Note Content
              </label>
              <textarea
                className="w-full h-32 px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                placeholder="Write your notes here..."
                value={newNote?.content}
                onChange={(e) => setNewNote({ ...newNote, content: e?.target?.value })}
                required
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="default"
                size="sm"
                iconName="Save"
                iconPosition="left"
                onClick={editingNote ? handleSaveEdit : handleAddNote}
              >
                {editingNote ? 'Save Changes' : 'Add Note'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelEdit}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Notes List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredNotes?.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {searchQuery ? 'No matching notes found' : 'No notes yet'}
            </h3>
            <p className="text-muted-foreground">
              {searchQuery 
                ? 'Try adjusting your search terms' :'Start taking notes to remember important concepts'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredNotes?.map((note) => (
              <div key={note?.id} className="p-4 hover:bg-muted/30 transition-smooth">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      {note?.topic && (
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                          {note?.topic}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {new Date(note.updatedAt)?.toLocaleDateString()}
                      </span>
                    </div>
                    
                    <h3 className="font-medium text-foreground mb-2">{note?.title}</h3>
                    
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                      {note?.content}
                    </p>
                    
                    {note?.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {note?.tags?.map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Edit"
                      onClick={() => handleEditNote(note)}
                    >
                      <span className="sr-only">Edit note</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Trash2"
                      onClick={() => onDeleteNote(note?.id)}
                      className="text-error hover:text-error"
                    >
                      <span className="sr-only">Delete note</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyNotes;