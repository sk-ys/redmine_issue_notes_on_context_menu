class IssueNotesOnContextMenu::Hooks < Redmine::Hook::ViewListener
  render_on :view_layouts_base_html_head, :partial => "issue_notes_on_context_menus/layouts_base_html_head"
  render_on :view_issues_context_menu_end, :partial => "issue_notes_on_context_menus/issues_context_menu_end"
end
