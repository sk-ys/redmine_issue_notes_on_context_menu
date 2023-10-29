# Plugin's routes

Rails.application.routes.draw do
  resources :issue_notes_on_context_menus, only: [:show]
  get 'issue_notes_on_context_menus/:issue_id/new', to: 'issue_notes_on_context_menus#new', as: 'new_issue_notes_on_context_menu'
  post 'issue_notes_on_context_menus/:issue_id/create', to: 'issue_notes_on_context_menus#create', as: 'issue_notes_on_context_menus'
end
