import { test, expect } from '@playwright/test'
import { registerAccountFlowTests } from '../../prototype-react/tests/account-flow-cases.js'

registerAccountFlowTests(test, expect)
