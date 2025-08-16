const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T => {
  let timerId: number | null;

  return ((...args: Parameters<T>) => {
    if (!timerId) {
      timerId = setTimeout(() => {
        func(...args);

        timerId = null;
      }, delay);
    }
  }) as T;
};

export default throttle;
