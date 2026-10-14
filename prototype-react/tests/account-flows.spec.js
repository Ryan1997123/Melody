import { test, expect } from '@playwright/test'
import { registerAccountFlowTests } from './account-flow-cases.js'

registerAccountFlowTests(test, expect)
