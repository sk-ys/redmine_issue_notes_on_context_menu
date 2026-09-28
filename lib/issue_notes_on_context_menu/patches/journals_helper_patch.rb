module IssueNotesOnContextMenu
  module Patches
    module JournalsHelperPatch
      def self.included(base)
        base.send(:include, InstanceMethods)
      end
  
      module InstanceMethods
        def render_notes_on_context_menu(issue, journal)
          if journal.nil? || journal.frozen? || journal.notes_and_details_empty?
            # Return an empty context menu for frozen or empty journals
            return content_tag(
              'div', 'Please report this issue to your administrator.'.html_safe,
              class: "wiki issue_notes_on_context_menu failed_to_load",
              data: {
                title: "Failed to load notes",
                journal_id: nil,
                journal_ids: [].to_s,
                editable: false,
                label_context_menu: labelContextMenu("-"),
              })
          end

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
              label_context_menu: labelContextMenu(journal_with_notes.count),
            })
        end

        def labelContextMenu(content)
          "#{l(:field_notes)} (#{content})"
        end
      end
    end
  end
end

unless JournalsHelper.included_modules.include?(IssueNotesOnContextMenu::Patches::JournalsHelperPatch)
  JournalsHelper.send(:include, IssueNotesOnContextMenu::Patches::JournalsHelperPatch)
end
