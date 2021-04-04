export function Singleton(...args: any[]) {
  return (Target: any) => {

    //static instance getter method
    Target.getInstance = function (...args: any[]) {

      // save a reference to the original constructor
      const original = Target

      // a utility function to generate instance of a class
      function construct(constructor: (...args: any[]) => any) {
        const c: any = function () {

          // @ts-ignore
          return constructor.apply(this, args)
        }
        c.prototype = constructor.prototype
        return new c()
      }

      //new constructor
      const f: any = function () {
        return construct(original)
      }

      if (!original.instance) {
        // copy prototype so intanceof operator still works
        f.prototype = original.prototype
        original.instance = new f()
      }

      return original.instance
    }

  }
}

