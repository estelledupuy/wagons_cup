require 'open-uri'

class ComputeNewPosition
    attr_accessor :boat, :direction

    def initialize(boat, direction)
      @boat = boat
      @direction = direction
    end

    def call
      time_interval = (0.16).fdiv(60) # inputs in minutes, output in hours
      wind_dir = wind_direction #info extracted from API, in degrees
      adj_coeff = 150 # A utiliser pour ajuster la distance parcourue aux besoins de la démo
      wind_speed = wind_speedy #info extracted from API, in MPH
      # boat_speed = allure-derived coeff * wind_speed
      # DIRECTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] avec 1: vent debout (0°), 2 & 10: Près (45°); 3 & 9: Bon près (60°);
      # 4 & 8: Travers (90°); 5 & 7: Grand largue (135°); 6: Vent arrière.
      # (degree) >> axe bateau / vent
      # https://fr.wikipedia.org/wiki/Allure_(marine)
      case @direction
      when 1
        allure_coeff = -10%
        gamma = wind_dir - 180
      when 2
        allure_coeff = 90%
        gamma = wind_dir + 45 -180
      when 10
        allure_coeff = 90%
        gamma = wind_dir - 45 - 180
      when 3
        allure_coeff = 170%
        gamma = wind_dir + 60 - 180
      when 9
        allure_coeff = 170%
        gamma = wind_dir - 60 - 180
      when 4
        allure_coeff = 250%
        gamma = wind_dir - 90 - 180
      when 8
        allure_coeff = 250%
        gamma = wind_dir + 90 - 180
      when 5
        allure_coeff = 120%
        gamma = wind_dir + 135 - 180
      when 7
        allure_coeff = 120%
        gamma = wind_dir - 135 - 180
      else 6
        allure_coeff = 60%
        gamma = wind_dir +180 - 180
      end

      boat_speed = allure_coeff * wind_speed
      boat_distance = boat_speed * time_interval * adj_coeff * 1.609 # 1.609 pour passer de mille à km
      gamma_radian = (gamma * Math::PI) / 180
      lat_change = - boat_distance * Math.cos(gamma_radian) / 110.574
      lon_change = - boat_distance * Math.sin(gamma_radian) / (111.32 * Math.cos((lat_change * Math::PI) / 180))
      new_lat = @boat.latitude + lat_change
      new_lon = @boat.longitude + lon_change
      return [new_lat, new_lon]
    end
end

private

def wind_info
  url = "https://api.aerisapi.com/observations/closest?p=#{@boat.latitude},#{@boat.longitude}&client_id=#{ENV["CLIENT_ID"]}&client_secret=#{ENV["CLIENT_SECRET"]}"

  payload = URI.open(url).read
  data = JSON.parse(payload)
  @wind_speedy = data['response'].first['ob']['windMPH']
  @wind_direction = data['response'].first['ob']['windDirDEG']
  @weather = data['response'].first['ob']['weather']
  @tempc = data['response'].first['ob']['tempC']
  @icon = data['response'].first['ob']['icon']
end
