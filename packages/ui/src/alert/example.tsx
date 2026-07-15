import { DemoFrame, DemoStack } from '../example-theme/demo'
import { Alert, AlertDescription, AlertTitle } from './index'

export default function Example() {
  return (
    <DemoFrame title="Alerts" description="Status colors remain derived from the active color theme.">
      <DemoStack>
        {(['default', 'info', 'success', 'warning', 'danger'] as const).map((variant) => (
          <Alert key={variant} variant={variant}>
            <AlertTitle>{variant === 'default' ? 'Update available' : variant}</AlertTitle>
            <AlertDescription>A concise message with semantic status treatment.</AlertDescription>
          </Alert>
        ))}
      </DemoStack>
    </DemoFrame>
  )
}
'use client'
