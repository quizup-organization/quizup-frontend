import type { ReactNode } from 'react'
import { Component } from 'react'
import type { ProblemDetails } from '@/shared/types/error.types'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  error: unknown
}

interface ErrorWithProblem {
  response?: {
    data?: ProblemDetails
  }
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return { error }
  }

  render() {
    if (!this.state.error) {
      return this.props.children
    }

    const maybeProblem = (this.state.error as ErrorWithProblem)?.response?.data

    return (
      <div className="mx-auto mt-16 max-w-xl rounded-lg border bg-card p-6 text-card-foreground">
        <h1 className="text-xl font-semibold">Une erreur est survenue</h1>
        <p className="mt-2 text-sm text-muted-foreground">{maybeProblem?.title ?? 'Erreur inattendue'}</p>
        <p className="mt-1 text-sm">{maybeProblem?.detail ?? 'Veuillez recharger la page.'}</p>
      </div>
    )
  }
}

