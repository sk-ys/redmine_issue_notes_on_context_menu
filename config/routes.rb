# Plugin's routes

Rails.application.routes.draw do
  resources :issue_notes_on_context_menus, only: [:show]
end
