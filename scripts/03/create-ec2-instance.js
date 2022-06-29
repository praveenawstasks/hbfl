// Imports
const {
  EC2Client,
  AuthorizeSecurityGroupIngressCommand,
  CreateKeyPairCommand,
  CreateSecurityGroupCommand,
  RunInstancesCommand
} = require('@aws-sdk/client-ec2')
const helpers = require('./helpers')

function sendCommand (command) {
  const client = new EC2Client({ region: process.env.AWS_REGION })
  return client.send(command)
}

// Declare local variables
const sgName = 'hamster_sg'
const keyName = 'hamster_key'

// Do all the things together
async function execute () {
  try {
    await createSecurityGroup(sgName)
    const keyPair = await createKeyPair(keyName)
    await helpers.persistKeyPair(keyPair)
    const data = await createInstance(sgName, keyName)
    console.log('Created instance with:', data)
  } catch (err) {
    console.error('Failed to create instance with:', err)
  }
}

// Create functions
async function createSecurityGroup (sgName) {
  const sgParams = {
    Description: sgName,
    GroupName: sgName
  }
  const createCommand = new CreateSecurityGroupCommand(sgParams)
  const data = await sendCommand(createCommand)

  const rulesParams = {
    GroupId: data.GroupId,
    IpPermissions: [
      {
        IpProtocol: 'tcp',
        FromPort: 22,
        ToPort: 22,
        IpRanges: [{ CidrIp: '0.0.0.0/0' }]
      },
      {
        IpProtocol: 'tcp',
        FromPort: 3000,
        ToPort: 3000,
        IpRanges: [{ CidrIp: '0.0.0.0/0' }]
      }
    ]
  }
  const authCommand = new AuthorizeSecurityGroupIngressCommand(rulesParams)
  return sendCommand(authCommand)
}

async function createKeyPair (keyName) {
  const params = {
    KeyName: keyName
  }
  const command = new CreateKeyPairCommand(params)
  return sendCommand(command)
}

async function createInstance (sgName, keyName) {
  const params = {
    ImageId: 'ami-00a41699ce2331b3e',
    InstanceType: 't2.small',
    KeyName: keyName,
    MaxCount: 1,
    MinCount: 1,
    SecurityGroups: [ sgName ],
    UserData: 'IyEvYmluL2Jhc2gNCnN1ZG8gYXB0LWdldCB1cGRhdGUNCnN1ZG8gYXB0LWdldCAteSBpbnN0YWxsIGdpdA0Kc3VkbyBybSAtcmYgL2hvbWUvYml0bmFtaS9oYmZsDQpnaXQgY2xvbmUgaHR0cHM6Ly9naXRodWIuY29tL3ByYXZlZW5hd3N0YXNrcy9oYmZsLmdpdCAvaG9tZS9iaXRuYW1pL2hiZmwNCmNob3duIC1SIGJpdG5hbWk6IC9ob21lL2JpdG5hbWkvaGJmbA0KY2QgL2hvbWUvYml0bmFtaS9oYmZsDQpzdWRvIHJtIC1yZiBub2RlX21vZHVsZXMNCnN1ZG8gbnBtIGNpDQpucG0gcnVuIHN0YXJ0DQo='
  }
  const command = new RunInstancesCommand(params)
  return sendCommand(command)
}

execute()