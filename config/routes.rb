Rails.application.routes.draw do
  root to: "pages#home"
  resources :races, only: [:index]
  resources :boats, only: %i[new create]
  resources :games, only: [:new] do
    resources :boats, only: %i[update]
  end
  devise_for :users
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
end
