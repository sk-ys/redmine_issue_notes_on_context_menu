class NotesOnContextMenu::Hooks < Redmine::Hook::ViewListener
  render_on :view_issues_context_menu_end, :partial => "notes_on_context_menu/issues_context_menu_end"
end
