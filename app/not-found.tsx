export default function NotFound() {
  return (
    <div className="mx-auto max-w-7xl p-4">
      <div className="lg:px-24 lg:py-24 md:py-20 md:px-44 px-4 py-24 items-center flex justify-center flex-col-reverse lg:flex-row md:gap-28 gap-16">
        <div className="w-full xl:w-1/2 relative pb-12 lg:pb-0">
          <div className="">
            <div className="text-[130px] mx-auto flex flex-row justify-center ">
              404
            </div>
            <div className="">
              <div>
                <h1 className="my-2 font-bold text-2xl">
                  Ooops... sieht so aus, als ob du die Tür zum Nirgendwo
                  getroffen hast
                </h1>
                <p className="my-2">Diese Seite existiert nicht</p>
                <div className="text-lg mt-4 text-gray-200 mb-12">
                  <div className="flex flex-row justify-center gap-x-2">
                    <div className="flex-row w-48 inline-flex justify-center rounded-xl bg-sky-600  hover:bg-sky-700 px-4 py-2 text-[16px] font-medium text-gray-200">
                      <a href="/" className="flex flex-row">
                        Zurück zu Home
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
