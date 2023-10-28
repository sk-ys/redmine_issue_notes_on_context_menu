module IssueNotesOnContextMenusHelper
  def render_notes(issue, journal)
    journal_with_notes = issue.visible_journals_with_index.select{|journal| journal.notes.present?}
    journal_ids = journal_with_notes.map{|journal| journal.id}
    content_tag(
      'div', textilizable(journal, :notes),
      class: "wiki issue_notes_on_context_menu",
      data: {
        title: "#{l(:field_notes)}(#{journal_ids.index(journal.id)+1}/#{journal_ids.count}) - #{format_time(journal.respond_to?(:updated_on) ? journal.updated_on : journal.created_on)} - #{h(journal.user)}",
        journal_id: journal.id,
        journal_ids: journal_ids.to_s,
        editable: journal.editable_by?(User.current),
      })
  end
end