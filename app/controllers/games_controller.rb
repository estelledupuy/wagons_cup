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
    uri = "https://api.aerisapi.com//conditions/closest?p=#{@boat.latitude},#{@boat.longitude}&client_id=#{ENV["CLIENT_ID"]}&client_secret=#{ENV["CLIENT_SECRET"]}"
    payload = URI.open(uri).read
    data = JSON.parse(payload)
    @image_url = data['response']&.first['periods']&.first['icon']
    @wind_speedy = data['response']&.first['periods']&.first['windSpeedMPH']
    @wind_direction = data['response']&.first['periods']&.first['windDirDEG']
    @weather = data['response']&.first['periods']&.first['weather']
    @tempc = data['response']&.first['periods']&.first['tempC']
  end
end
