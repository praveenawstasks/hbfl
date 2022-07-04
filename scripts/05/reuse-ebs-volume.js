// Imports
const {
  AttachVolumeCommand,
  DetachVolumeCommand
} = require('@aws-sdk/client-ec2')
const { sendCommand, sleep } = require('./helpers')

// Declare local variables
const volumeId = 'vol-070c74d6f2088351f'
const instanceId = 'i-02e5e77019b19223a'

async function execute () {
  try {
    await detachVolume(volumeId)
    console.log('Detached volume:', volumeId)
    await sleep(3)
    await attachVolume(instanceId, volumeId)
    console.log(`Attached volume: ${volumeId} to instance: ${instanceId}`)
  } catch (err) {
    console.error('Could not attach volume:', err)
  }
}

async function detachVolume (volumeId) {
  const params = {
    VolumeId: volumeId
  }
  const command = new DetachVolumeCommand(params)
  return sendCommand(command)
}

async function attachVolume (instanceId, volumeId) {
  const params = {
    InstanceId: instanceId,
    VolumeId: volumeId,
    Device: '/dev/sdf'
  }
  const command = new AttachVolumeCommand(params)
  return sendCommand(command)
}

execute()
