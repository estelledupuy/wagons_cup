class ComputePositionJob < ApplicationJob
  queue_as :default

  def perform(id)
    @boat = Boat.find(id)
    direction = @boat.direction
    puts "direction #{direction}"
    @boat.latitude = ComputeNewPosition.new(@boat, direction).call[0] #Get param from user decision
    puts "latitude #{@boat.latitude}"
    @boat.longitude = ComputeNewPosition.new(@boat, direction).call[1]
    puts "longitude #{@boat.longitude}"
    @boat.direction = direction
    @boat.save!
    puts "last boat saved #{Boat.last}"
  end
end
