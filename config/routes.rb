Rails.application.routes.draw do
  resources :races, only: [:index]
  resources :games, only: [:new] do
    resources :boat, only: %i[new create update]
  end
  root to: "pages#home"
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
end
