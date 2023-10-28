# Plugin's routes

Rails.application.routes.draw do
  resources :notes_on_context_menus, only: [:show]
end
