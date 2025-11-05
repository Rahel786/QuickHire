import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BookmarkedContent = ({ bookmarks, onRemoveBookmark, onOpenContent }) => {
  if (bookmarks?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg shadow-card p-8 text-center">
        <Icon name="Bookmark" size={48} className="text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No Bookmarks Yet</h3>
        <p className="text-muted-foreground">
          Start bookmarking important concepts and lessons for quick access later.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg shadow-card">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Bookmarked Content</h2>
          <span className="text-sm text-muted-foreground">{bookmarks?.length} items</span>
        </div>
      </div>
      <div className="divide-y divide-border">
        {bookmarks?.map((bookmark) => (
          <div key={bookmark?.id} className="p-4 hover:bg-muted/30 transition-smooth">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name={bookmark?.icon} size={16} className="text-primary" />
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                    {bookmark?.topic}
                  </span>
                  {bookmark?.difficulty && (
                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                      bookmark?.difficulty === 'Easy' ?'bg-success/10 text-success' 
                        : bookmark?.difficulty === 'Medium' ?'bg-warning/10 text-warning' :'bg-error/10 text-error'
                    }`}>
                      {bookmark?.difficulty}
                    </span>
                  )}
                </div>
                
                <h3 className="font-medium text-foreground mb-1 truncate">
                  {bookmark?.title}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {bookmark?.description}
                </p>
                
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Icon name="Clock" size={12} />
                    <span>{bookmark?.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Calendar" size={12} />
                    <span>Saved {bookmark?.savedDate}</span>
                  </div>
                  {bookmark?.lastAccessed && (
                    <div className="flex items-center space-x-1">
                      <Icon name="Eye" size={12} />
                      <span>Viewed {bookmark?.lastAccessed}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="ExternalLink"
                  onClick={() => onOpenContent(bookmark)}
                >
                  <span className="sr-only">Open content</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="BookmarkX"
                  onClick={() => onRemoveBookmark(bookmark?.id)}
                  className="text-error hover:text-error"
                >
                  <span className="sr-only">Remove bookmark</span>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookmarkedContent;