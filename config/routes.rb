Rails.application.routes.draw do
  devise_for :users
  resources :races, only: [:index] do
    member do
      get '/coordinates', to: "races#coordinates"
    end
  end

  resources :games, only: [:new] do
    resources :boat, only: %i[new create update]
  end
  root to: "pages#home"
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
end
