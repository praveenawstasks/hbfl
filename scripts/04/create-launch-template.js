// Imports
const {
  CreateLaunchTemplateCommand
} = require('@aws-sdk/client-ec2')

const helpers = require('./helpers')

const ltName = 'hamsterLT'
const roleName = 'hamsterLTRole'
const sgName = 'hamster_sg'
const keyName = 'hamster_key'

async function execute () {
  try {
    const profileArn = await helpers.createIamRole(roleName)
    const response = await createLaunchTemplate(ltName, profileArn)
    console.log('Created launch template with:', response)
  } catch (err) {
    console.error('Failed to create launch template with:', err)
  }
}

async function createLaunchTemplate (ltName, profileArn) {
    const params = {
        LaunchTemplateName: ltName,
        LaunchTemplateData: {
            IamInstanceProfile: {
                Arn: profileArn
            },
            ImageId: 'ami-08e8745d85f5b4430',
            InstanceType: 't2.micro',
            KeyName: keyName,
            SecurityGroups: [ sgName ],
            UserData: 'IyEvYmluL2Jhc2gNCmN1cmwgLS1zaWxlbnQgLS1sb2NhdGlvbiBodHRwczovL3JwbS5ub2Rlc291cmNlLmNvbS9zZXR1cF8xNi54IHwgc3VkbyBiYXNoIC0NCnN1ZG8geXVtIGluc3RhbGwgLXkgbm9kZWpzDQpzdWRvIHl1bSBpbnN0YWxsIC15IGdpdA0KY2QgL2hvbWUvZWMyLXVzZXINCmdpdCBjbG9uZSBodHRwczovL2dpdGh1Yi5jb20vcHJhdmVlbmF3c3Rhc2tzL2hiZmwuZ2l0DQpjZCBoYmZsDQpzdWRvIG5wbSBpDQpucG0gcnVuIHN0YXJ0DQoNCg=='
        }
    }
    const command = new CreateLaunchTemplateCommand(params)
    return helpers.sendCommand(command)
}

execute()