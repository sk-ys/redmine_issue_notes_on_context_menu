require_dependency File.expand_path('../lib/notes_on_context_menu/hooks.rb', __FILE__)

Redmine::Plugin.register :redmine_notes_on_context_menu do
  name 'Redmine Notes On Context Menu plugin'
  author 'sk-ys'
  description 'This is a plugin for Redmine'
  version '0.0.1'
  url 'https://github.com/sk-ys/redmine_notes_on_context_menu'
  author_url 'https://github.com/sk-ys'
end
