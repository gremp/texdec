export function Singleton(...args: any[]) {
  return (Target: any) => {

    Object.defineProperty(Target, '__singleton_instance', {value: new Target(), writable: false})
    //static instance getter method
    Target.getInstance = function (...args: any[]) {
      return Target.__singleton_instance
    }

  }
}

