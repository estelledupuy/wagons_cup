Rails.application.routes.draw do

  root to: "pages#home"

  resources :races, only: [:index] do
    member do
      get '/coordinates', to: "races#coordinates"
    end

    resources :boats, only: %i[new create]
  end

  resources :games, only: [:new, :show]
  resources :boats, only: %i[update]

  get "/boat_select", to: "boats#select"

  devise_for :users

  # Sidekiq Web UI, only for admins.
  require "sidekiq/web"
  authenticate :user, ->(user) { user.admin? } do
    mount Sidekiq::Web => '/sidekiq'
  end

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
end
