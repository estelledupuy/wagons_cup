class ComputeAllPositionsJob < ApplicationJob
  queue_as :default

  def perform
    @boats = Boat.where.not(direction: "nil")
    @boats.each do |boat|
      ComputeNewPositionJob.perform_later(boat.id) # !! Attention, fixer "time_interval" dans compute_new_position, à la meme valeur
    end
  end
end
