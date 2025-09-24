type ToastOptions = {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
};

export function useToast() {
  function toast(opts: ToastOptions) {
    if (opts.variant === 'destructive') {
      console.error(`[Toast] ${opts.title ?? ''} ${opts.description ?? ''}`.trim());
    } else {
      console.log(`[Toast] ${opts.title ?? ''} ${opts.description ?? ''}`.trim());
    }
  }
  return { toast };
}

