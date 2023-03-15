require "open-uri"
require 'json'

class GamesController < ApplicationController
  def new
    @game = Game.new
  end

  def create
  end

  def show
    @boat = Boat.find(params[:boat_id])
    fetch_weather_data
  end

  private

  def fetch_weather_data
    uri = "https://api.aerisapi.com/observations/closest?p=#{@boat.latitude},#{@boat.longitude}&client_id=#{ENV["CLIENT_ID"]}&client_secret=#{ENV["CLIENT_SECRET"]}"
    payload = URI.open(uri).read
    data = JSON.parse(payload)
    @image_url = data['response'].first['ob']['icon']
    @wind_speedy = data['response'].first['ob']['windMPH']
    @wind_direction = data['response'].first['ob']['windDirDEG']
    @weather = data['response'].first['ob']['weather']
    @tempc = data['response'].first['ob']['tempC']
  end
end
