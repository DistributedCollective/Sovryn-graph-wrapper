import { CronJob } from 'cron'
import assetMainFunction from './assets'
import summaryMainFunction from './summary'
import log from '../logger'

const logger = log.logger.child({ module: 'Cron Jobs' })

class AbstractCronJob {
  cronFunction: () => Promise<void>
  cronJob: CronJob
  jobName: string

  constructor (
    cronFunction: () => Promise<void>,
    cronTime: string,
    jobName: string
  ) {
    this.cronFunction = cronFunction
    this.jobName = jobName
    this.cronJob = new CronJob(
      cronTime,
      () => {
        try {
          logger.info(
            {
              job: jobName
            },
            `Starting cron job: ${jobName}`
          )
          this.cronFunction().catch((e) => {
            const error = e as Error
            logger.error(`Error running cronjob: ${this.jobName}`, {
              error: error
            })
            logger.error(error)
          })
        } catch (e) {
          const error = e as Error
          logger.error(`Error running cronjob: ${this.jobName}`, {
            error: error
          })
          logger.error(error)
        }
      },
      () => {
        logger.info(
          {
            job: jobName
          },
          `Cron job completed: ${jobName}`
        )
      },
      true
    )
  }
}

const assetsScheduledTask = new AbstractCronJob(
  assetMainFunction,
  '0 */6 * * *',
  'assets scheduled task'
)

const summaryScheduledTask = new AbstractCronJob(
  summaryMainFunction,
  '*/5 * * * *',
  'summary scheduled task'
)

export const jobList: AbstractCronJob[] = [
  assetsScheduledTask,
  summaryScheduledTask
]
