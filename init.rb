require_dependency File.expand_path('../lib/issue_notes_on_context_menu/hooks.rb', __FILE__)
require_dependency File.expand_path('../lib/issue_notes_on_context_menu/patches/journals_helper_patch.rb', __FILE__)

Redmine::Plugin.register :redmine_issue_notes_on_context_menu do
  name 'Redmine Issue Notes On Context Menu plugin'
  author 'sk-ys'
  description 'This plugin adds a menu item to the existing context menu to display the issue notes dialog.'
  version '0.2.0'
  url 'https://github.com/sk-ys/redmine_issue_notes_on_context_menu'
  author_url 'https://github.com/sk-ys'
end
