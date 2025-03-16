// Mock types for operations
export type GetUser<Args, Result> = (args: Args, context: any) => Promise<Result>;
export type GetResumes<Args, Result> = (args: Args, context: any) => Promise<Result>;
export type GetResumeById<Args, Result> = (args: Args, context: any) => Promise<Result>;
export type GetJobs<Args, Result> = (args: Args, context: any) => Promise<Result>;
export type GetJobById<Args, Result> = (args: Args, context: any) => Promise<Result>;
export type GetJobApplications<Args, Result> = (args: Args, context: any) => Promise<Result>;
export type GetInterviews<Args, Result> = (args: Args, context: any) => Promise<Result>;
export type GetInterviewById<Args, Result> = (args: Args, context: any) => Promise<Result>;
export type GetCoverLetters<Args, Result> = (args: Args, context: any) => Promise<Result>;
export type GetLinkedInProfile<Args, Result> = (args: Args, context: any) => Promise<Result>;
export type GetLinkedInPosts<Args, Result> = (args: Args, context: any) => Promise<Result>;
export type GetNetworkingStrategies<Args, Result> = (args: Args, context: any) => Promise<Result>;

export type UploadResume<Args, Result> = (args: Args, context: any) => Promise<Result>;
export type AnalyzeResume<Args, Result> = (args: Args, context: any) => Promise<Result>;
export type ChangeResumeFormat<Args, Result> = (args: Args, context: any) => Promise<Result>;
export type SearchJobs<Args, Result> = (args: Args, context: any) => Promise<Result>;
export type ApplyToJob<Args, Result> = (args: Args, context: any) => Promise<Result>;
export type GenerateCoverLetter<Args, Result> = (args: Args, context: any) => Promise<Result>;
export type CreateMockInterview<Args, Result> = (args: Args, context: any) => Promise<Result>;
export type SaveRecording<Args, Result> = (args: Args, context: any) => Promise<Result>;
export type SubmitAnswer<Args, Result> = (args: Args, context: any) => Promise<Result>;
export type ResearchCompany<Args, Result> = (args: Args, context: any) => Promise<Result>;
export type GenerateLinkedInProfile<Args, Result> = (args: Args, context: any) => Promise<Result>;
export type GenerateLinkedInPost<Args, Result> = (args: Args, context: any) => Promise<Result>;
export type GenerateNetworkingStrategy<Args, Result> = (args: Args, context: any) => Promise<Result>;
export type GenerateFinancialPlan<Args, Result> = (args: Args, context: any) => Promise<Result>;
export type CreateCheckoutSession<Args, Result> = (args: Args, context: any) => Promise<Result>;
export type UpdateSubscription<Args, Result> = (args: Args, context: any) => Promise<Result>;

// Mock implementation of useQuery hook
export const useQuery = jest.fn((queryFn, args) => {
  return {
    data: null,
    isLoading: false,
    error: null,
    refetch: jest.fn(),
  };
});

// Mock implementation of useAction hook
export const useAction = jest.fn((actionFn) => {
  return [
    jest.fn().mockImplementation(() => Promise.resolve({})),
    {
      isLoading: false,
      error: null,
    },
  ];
});
