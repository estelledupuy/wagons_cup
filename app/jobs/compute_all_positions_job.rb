class ComputeAllPositionsJob < ApplicationJob
  queue_as :default

  def perform
    @boats = Boat.where.not(direction: nil)

    @boats.each do |boat|
      ComputePositionJob.perform_later(boat.id)
    end
  end
end
