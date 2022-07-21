module.exports = {
  apps: [
    {
      name: 'ppe-room',
      exec_mode: 'cluster',
      instances: 'max', // Or a number of instances
      script: 'npm',
      args: 'run preview'
    }
  ]
}
