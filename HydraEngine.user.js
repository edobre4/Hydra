// ==UserScript==
// @name         Hydra Engine
// @version      0.5
// @description  AI-powered pipeline optimization engine for NASC sort centers
// @author       eddobrev
// @match        https://admin.faststart.ats.amazon.dev/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      trans-logistics.amazon.com
// @connect      na.prod.wattwebsite.sorttech.amazon.dev
// @connect      stem-na.corp.amazon.com
// @connect      code.amazon.com
// @connect      *
// ==/UserScript==

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 1: CONFIGURATION
    // ═══════════════════════════════════════════════════════════════════════════

    var ENGINE_VERSION = '0.5';
    var HYDRA_TEXT_LOGO = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADsAAAAcCAYAAADfjMc9AAAPN0lEQVR42pWZWZAdV3nHf+ec3u69c2fuLJpFGmuXrNWyhS1bFhhsQ2xhZMBxQgFJFRThJSEPpFKVPIHzkEpVqpJUHlLJQ1IJlRASxwaKxXjBdjAUGFuykdA+GmlGs8/cufvS2zknD3c0mpFMldNV3ff26e7T3//b+vv+R7iFnVZbgQIsFmDlCCAQq6M3Rli5UwIWsXp87+3mlZuzmJVxccvM9pYnbj7zm+dft9lbb70xYBFYpLGQE5bUGoToDAtxq8B2jXhiDTjxPoCalb1zbqymIDNkpItZM29HsWLdO8X/Byi3A10rMYDUVrBLWT7S5ZIkGlcKUtOxGzd1cpu936+iQaxgEYDE2IQD3iaGVS/GaiTyPQFZIdbZ+zfN/l54hZQIcVPmG7CllILxyPDl/oBj/VnCMGZLxic1Giluuq0AlOhYPbUWKUCK9wFVgESgjUUJQc712CEG2KIGwKZokyKFXFHGGj+x72VVuwb8+mtCCKSjsFKQ1hvoOAah1qlEOliqwuH5mQp/N1rgqaFuPpSTfGrnCEkrxNqOq2kEcZySakO/q0hSTZJqlBA4K/taQQUWhSVJDbG2WKP5zKbt5G2GUboZcfpxnS4Gu0eIwwomjTsCS4lSCqUUUkmko1CORCmJELeGTUc2ISVpHJMslzH1Jlse+RDDD96PiSLEqlwWx1pACl6N4NDYLM/sGWVquUx2IEtu3x18e7JImGruynkc2rqB70yXGFKWL+7ZyH/NlJmuNDtathbhOUjRcYfUAtZw14ZeKtUGf37wECeLIWldM1LIkxs6wA/PnWTbhn0c2Pkgv7jwEo16CdIUjAVrO7834lq5yFwWx1ForVfCQ4DWpGFM/+ZRtn7oAXY+fQI5tInvfO4PYFU5nTkcg6ULqDgu55oN1NgUTxzYSRDH/NWdg5SWq7xQMVxpRPzZcMhXjm7l+GvnqS6X+N49o/ykWGfB8QiV4tuXZpkKU5QQ9DgOf7h7mI8HPl73Hk5Na751/Qqf9DaT7+vHbtzMY+GTPDf+Pzy0+wm+9OTXacg6C0mVhq1hAkMSSFJfkbRaNK9c5frb7xJVqrj5ro4ukoRg4wgn/uYvUIcOkgwN0J4r88t/+HfC8XGc7m7sDcUAjrYwoix7PYfv2wxmsUx3rcXx/dv4znMv8Uu6EMqjieTfzk/x9e6A1z51hOM/PIX/09N89ZNH2T7Sy5kzE/x7nCClJNWWu7OSr4x0EyqHH11p882rFfqVYK8/zEy9hHVaHDv2cfytA3zj5b9lcmGMI/seZ/+9h9hx4h4WCy5zWUEtsGwZzJABahev8NqffI23X3kDt6cb4oREa2ZGt/OB/m5spczLv56AqLWaYNdujisF46nh6cCwIetxra0oTc9xqV5lIBuQsRlEO0E4irzrcKUW8rAUPJoVvFrxGX7hFE987lEcIfEyAaYRAYKDIkUK+N6y5ieXphkPEr48cIix4izViXl8Ktz94Y9x7MMfp2/XJv7+H79K7Z0yj5kvEDUSJm2L+XYN987NTPe5HN7WzVMP74dv/hNTj3yahUtXEUoSSEFoDTZOcBerhD15Mj1dnVxzS8JWTtD/TCok462IJ33JnoyPjprs8z16chl+1jbMpBZlLZ8b7kJUq5CmlBZKvBnkucu0iSsVHty7lYuR5sx0iY15j7+8cwMXZypcmGixmJNsCnp4rGeE15emmRcR9WadsfPn2XLXdrbdd5R6NeTc2VfZtPsI+cJWwkyGmfFfM/nWCxSXqpyNClyplpnZvQXZiJn/8WtYLBvu2s/RP/4iE6cu8/qLpxg4she/2aD44stYR60DKw3gYJlzPP671uJys4G10OfA5VabyVjjKIkRgvPLdbpsyqBj6QtclsOYMeEyMzvPfBzz2YKDlfCJbsme3gynqyGn62VOt0Mez/Qyr0N8v8BpZ57Lzjza0bzxnz9iYWGRI48+iZfNM7c0Dnf30XN0FGOqLJ58geUf/DN2/B3OTjcoXZ6ltmETTlcWopjCfYdptlOmJpepBF24pTKF/XvIDQ2ikwSxpkLquLa1POpZzrlZrmlBgGVWW0ayPkVjSRONSQ3CWrZ4Cs91Ua6HBlqOS7dQzE3NcXca81B/wFOFgIlyRNyMuKoSDjgBr+t5ugoZulUWIR1qpsmMWKZVqbJw+gKB209f/g6kI+jd1EPa7yPzWVS+H2MtSVhCbB5iemyOsNoCqZCZgJGHPkip1qRca9CVD1ieKZEMD9Nz134II5A3o1dKIEUQGMvXcmB1wojrsDvj4Vfr/FaPz0cHczwylOOeQoZebfBSja8kGsEbsWBOO1y4cI04jfjrAmx1DN8dm2XRaqrK42S4zLFuh9FEkunq6sQPDmVdwbqS+uUi4USd/t47SJstwoZGFLLIjELXZ7DSZfipx/G3D6IXqujJKdJahZ7t2zBbt9JcbBBfm0SfepNI+kRSUjj6ABi9rtJyrO18rl5JBAeJebqQoxKHOMKye7if57uzRN05/IxL3I6Yny3R7wp2Zl0GfCjGhudTxWfbNWbqTXaEEWctlGpt3hYBi2iOO/DBWo3SiEM2yGKtQQhFYlO0NMTlNu2lEq7yscLiIQmkZcvHjuD2/Cl7njyBeuR+zjz7U9T0MtE7b2J1m777PoDpKbB09jx69jrx1Utkjp9AzyzhHjpM0NNDnOpVV3YsoIBYSv4lknw6CrnXFTzfiEmSlFylhaOKNKTAR5ILXJhaZnvG44NZxXfDlAnH55rxOTVVZNd9d/LuO+O0EsN4oBAWfJ1SSVNaCFJjVkpDgbGafJDDEy7V8hJpqpGpJl9OsK0Gex+6n0efeoRER7z47E9ZfmuC9NLb1M6cQnp5cvfdR61YJy1Via+OEY1dpB+NbbbQ/RvI37mbpXd/hZPLYo3FudGXBFiWXZcLUch2relarPOjehvlOHhCdMp1rdkoUvZt28hzsxVeDDuxGwPvqhxbayVeL7ep1mJOenkaK27TNJa2hno7JTKm84kXIKygL8iTdQPmSktEYZMcLo1LS4xfmqc4M0/dJhTu3UTl8AHas69QevXbWNcnMzSEu3c/tYk5otk5/GYFm2rSyatUBg/jRQldhz/A0ltvIUS2Uy7eKKZ8LJ/3HZR1ibVmJOMzZBTPOxkSBIkQHEnbHJZt5o2hZQR4HsJ0YqIlJcJ1uPLuGHkvT1U6q+ESIqnFmlK9SZRKhO10xIFw6fcKxDamVp0nTVokeNSuTZPbNcDpC9+nGFcYLXyCHY955L5wgjdffZ64WqJr7zHiSBBPzjL6wAF2fuYb5AVMWcXkckhjuoi/cy9ONoM1Bou46cZVC6dDzXHl0JY+IZIB5ZBYSAUYaxHGUDWauTjljpxHrmko204tLIGckBTyAbPx+o4ktrCQWpZbDULjIoUkTZts7drFcNcIZxvTxFGTZlSjy9+ArleoX2uTpm3qc7+icnU/xf/tp/93H2bg4Y8w+9x/kNl9gNZMiXRihqVijerUIDKTQbRDGpPXMb29pH0bCDaN0pqeQnpBx40t4AnBSWuxoeVjGYUT+Dg2xU0sqbBIKxlVgnYqKYcRpxJYJosrOmHQtBBJh0HlUPEVcWxXeI5Oyp/Rhma7RVt4GJOyO7+NE8MfRSif5XCZRMeU2tNsDkapLS/RSnwy2W7SVoWwMsH0yT7co/vY+ZmnKf74ZbK79xEvFmlPzJC0qkhpEEGAiWNs7xBBrUnX9gfJHDxE4+o4MsjgSGFJLPQLyUFP0tIRM4mlHcVsVIrNQnI+1nhCEGIpA0fdgGFhIV7TdlqoCMm8o2jHEmcNz5BFoJOEsg3ZlBvlS91PMJrdQj6ziVem3qApLFVdJk0bKG1pxy18pxukBSFpLV5C3rGLyo9PUvjI/eQP3Y2dm6F7cIRyzif62WuktQpCKWwS0/v7f0RSqWPDmK4HHmT5B98DLPKGGy8aw4jwOBa4FNOUQStY1JqFxCCtJLaWKoqCFJwBHhzqY4/voK0FA9tcyaCxnKunTIcGX3SsaoFBpdjkdOMKh0i3KNg+Flt1Xpx8iWJYpx4VuVg6iXRybO7ZTWpjWu1lurJ94LiExTlMc4H5t85RO3eFTU//HtPPfYvi5DwyjUibDWQ2hwgyIBR67jruyDCtd06T2X+QYNcu0lodeaP9EcLywzhhmoAeTxFiaQlF095syl0BvY7L5XLIv85WmUs6bIaH5Xc29KAyGWKrcHBIrOj0s57L/UEXb6UxM+Ec45WzXClf5kzxLNOteWqmwoXGr9E24lD/vQwVRllOq9SWFxkd2EZhYBStE5oXfoE1CcWf/Qp/4w669uyk8sufQBJCmqz0vxqbJji5gOydu2gUG7Sniox85av4vf0oFfQ9AxYFNNHkcBBpQp+v6BYOJ7UlWun0H/Mk1kgmlM9LxhKxwkoKGGuGVBshOenQ5wS8Q0Id6LGCN8OYS1hqjkQoH5VC6gTMqEUmwytIIZHSxREu55bPUIqWqEWLLJavEcZ10jQkbdQBDX1bCKdnGHz8OOnURYovfR9rQTpOh0BQCpFqorELUJ6l8fYvSK5PIqJWJ0HdLJQtM2gGnDyhiRjyPdy4jTUw4EgyCl6I4aIUuPYGpSpAGMasIPQyDGhLKgTSKkBzWWuQtkOp2JAZ0WCju4VFqiwkM3gyg8GAsFxvXFnfk9UMUjpIqRCeQ+PqedJGhWTPvRjfof+3P0/h7kPMPvss9anrCCUQjkPr6mW4fL5TvAhBK00RfoBSfu8zN8EKKkbjSJ+sUdwRCK5pw4I2OMCbqWVBSNw1jN0q5YGlLAUGwQ6hWJKSOZPiy471JeAg0FYTqC5KtkrThh2y7Ua/KRyUUCi5sit3hSUUK4SZS1qvEk+P0Ro7Q+nnPyeu1zHNBkm10kn71iIcB+l5SNdFuC7K9xFSrbVsJ6G4Ai6aFm0RcE+ieMB3OROltG0HiLtKpq//lhoErhWclZasjhmRPkKs0Emr9JhFCocpPU9iE6SQ6yj41f92PaG2yiBbg3Q7EphmHV2rUJq4jPBclOd14nali7PW3kbpCrdnh73JxNt1pOWo8Hg84/DdsM2isTjr1gdu3H8rcEGKoRtB+5bVhPfDct++xiDWsb/rVgkEK+FhbwJdfdLeRsIKt2envV2kzgOpNWSExJdQN2sEEKKTlVbBchuHq+1qs3yrHteci9uWOVbfIkBYfsNSiOE97HPL+oVdF2YA/wdW8IwBcUuqBwAAAABJRU5ErkJggg==';
    var GOLD_DRAGON_ICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAoCAYAAACIC2hQAAANC0lEQVR42qWZW2xdV1rHf9/at3O/+RJfEsdxUqfNJOklJZR22mGGmcIIhDodXkBCjLgIoXlACFQhIUQfeOcBiRckXtBohGCgSJ0yokALdKJKcdskbVI7sR07dnw5Psf28bnvy1o8HB/7nMTpRWxp6+y9z95r/8//+9a3/t//iJ19zIDQ2cz+p/Qddj4MgYakgMEQKoUfdW7yLBADISBGMN3h+sb8/21K9gcTA503SN/YYjp7oOGsK4ybEB/B9yOOxS2+lbU5Jwa1f5/sP9OPT8AI0t0BdXC+/8zBnd0z6X0aZYwCI5jul+aBm8QQYPjlAZfTOuBOZKGB35rK8Ac5m92qz8chBPsv0d0hDshU+/v+O/bfZaDnuOc70yXK9BGnDiCL7guVAEqBHxl+Pu9yPmzzVlXjWYq/vljg2Sjib+5WuaoVoVIYBP1A9iBgwgjdbGEMKMtCLNVJD8CI6TDYG80+HuUAr92JEz00yEFO+Now6CguhT7/XmzwzHCG70+m+WR+j7/bqlBJpxizhDDS7BkhfDDXI01saAA7l6G9sExrpwR2DDuRwLItTKRBmw7b8mCq9OeopbyB1/tmzX6W+BhsEV5NClE9JJ92+P2pLLfvt3hjfZvp4QJfdW1SOqKhoQ5EyCFIAUQgjEhdfoqpP/wdzl56mkSjwd76Ju29PSIUtuuCCGI6yddHag+zYmemzYPfhmiejyueTgjJVkQm7nAq7fBPd+vcr1cYyznEohj3tDAjCj/qgLJVNzI9YDGYRhvn7Bkm//yPOPvNr3Nsbp7Vf/kxN974N1bvLIDt4iYTCKC17g9wF66dOXtwzRJoR4ZXBhSvxISmVqz7IfdrEffqITlPMZAyXCuVCQI4kxtmKBNnS0I+rEcstLrx2A+/QNhuQxhC2ABCkt/9DcZfe43RiTGebu+y+KM3+fQf3mBp5jqh7eAl40RhdDTQqJumkeHljOGPxx0k5vDDuU0Wt9uczg6wE2gQTdz1EduwUm3ity2G3ARlx8aN2xS1MNcSlHQnCgxOTTL63CWGv3IWNTTE5p0ltgKL1rOXsU6PMT5S4GLMsPTPb3HrL/+Kjdk7uNkcRhuMHCaqhTfwetoR8rbwXNbi20nFm8slSrrBxUHDqJ1mPJbgfqvG42mHk4UkG/WIYr1J0rLI2Smeyaa4qeFGPcS1FHqfTRGFFfPY3dmjqBJsxbKYs49ReOFZgqE8Kgqpza9x539vEXvxMhe+9x3ilT3Wrl7Hinm9GY/1wvjo639xMsNEFPAtL8btPZ+mVlihImsnqIQ287WQyZziRr3Ju6tbVJsNjsXSHPPiaNPG0w6/O5Fmw9bMV0Nse79OYqivbyLHp0ienqZ5c4Hy2+/TmrlFVK6RHh6gkHAZbvus/u37+LUUT/7eq8RrJZauvIfYMZRjd4C+OHTydbcaUKxrii1o+0LBTVD0A66WGmw1DQOexVYrIG27vHQ8h+Uolms1PBTH43C70WCnAd+dyPNBy6fU1tiWRVitMv3b3+Pkn71GeyhP4qtPc+LXfwXBovSPP6E5f59wZAx5apLxb55neyXgwx/8hMzXLjFy7iyV2TmaxRIoC3lx9KL5GSwaUZPNdg0ch6rfZr5a5Bv5DESKlnEQLO42A3x8osjHQzNmx3mmUGC+2SAyLmsCI8M5frTVxK83Gf+5n+XMn/wps59+Sv6586TOn6X4yQLN/7jK0O4Og6/8Iru1kMpuDVOIowpJrHSKRqWBFfewqjvk3n2H5b//IVbZyr3ebFRYp006l+A/G3DXuAz7DXwTcjmXp9y2WA8jxhKGHb+JMpoB1yZvCadiLhfycQI7hevFeWO7hiWKwMDkr76CKoySGsowcWGS9ttXKL11hep7HzAwPsLGRpXKRhV2GkR3VjC376M2qrilHXQzpNUIyT1xjmSzgt00mmuWhxXC3K6hoS3ixhATwROh2hbqkcY1bVarbSIUKTQSalzPZa5Rp5CFkrF5efIE78z6zFfbJNJJnnjpRXacGNt+hdUr19lc3KLVhqAdcuMHb2IX8sSnTiKOg/IclGXRureClc7hJePEc1lKo3UqH9/GtgCjhJCOQoqUkGrVGHIMZ5J5rlebzJkAbBdMwKiBLB5tE+Apw0tJj4+KDTYtm/nA4YWxIeZvzHLm619jbGqa1Q/epz6coXD2CfY2WuxuXAPfJzM9SVgp0rr2PxAFEAWYsIU4Lnhx3FPnSD5+geYb79FYuIlt+tZTGJKQS8mAROQikWIGKHqDnTKeyOD4ZYYwxIG6gmzW5hcGYyxuetwqVSHlIrbF8dHT3Hr3KjvUeeHXvsHMf8+wtzCHLu+SHhmgtfQx7c0VxLIQDEYEHIXRAdSatD/+Ka1ProCOOowfCmPQCI9bARM2XEgNMdsSik4SRxkcFaEE1lWchgSMxWK03TizyTTWYILh0VGS+QGub5Zx4kkqm2U8EQbHRrl79SZ7i0sEO9vkJyYI127TuL+IuB6iFCirI9XMvj5wHHBsxLYQ1wNkX+YBCiHUULZiuCrNzVqbXAzSotEdaY0oaIviRMIjdBWj6QTDx0/wk6IiPnyMU+fOsiMKv94gaRQjgwPsrm6yWW9w/IXLxNMpXDtA13dRrosY3VF4GDBdtb1/fHBq6KpaoKO2PAUfNw0fiUudiHdCwYh1kBoasI1GlObUYIqythgYyJOanGa3rWn6IZlUChEYdrOkKw2GlcMTF8+RCiMEwdgRQaOOKOtgUXhYMvXKxc5u93Y22oCj4Kf1iCnlUUMIxcIynSXRGCEWBZxJx6n4YOdHuFlqkT12nHYuQ2tlF+UbjG0xrD24s0rh9CDqfpnG4jqJdAHb7XIoDyu6z+qZejVftx1QAne0jRGFZcxhm6ANw54wlnGZ264xPjKIzo+wVG7hpWLkswWeT5/mUmGa0cAlsBWuMdRXyuRPHqcwPEQylSN1bBjj+4h0Vb35AkAP9KPpIVtwpAOwV26JgjCMmN9pkrcViytrDGRT+EFAvdXAPpPm4tgk3z/2PNZQFk4M0mo2yQ1lGc6m2VtexbQ02WMj6DA6SiU/snu1j1TU3b6qE+/eXpB6qBm3HZq2YqPp89Gny1RaAb6KkxvMYU7ZSKJA8+QAyrLRrTpuu8mH//oRUbWNSseprm0irtNH0MP5+VDozWFfjDnsjzE9Dd/hppWFY0Ot3uD8yRFso0klkmwuLVAtVlD5DNGpYSasDK3rN1levse95S3G80OkYjGy2NR2yp3JZMwjmDSPylH6WoeDG7udoXRAixjqxmKxFZKwNO3lRSaiPZ6aGOTZZ5/ik5mrFBe2GB8f4f2r/8XG5jrPfPtlcm0hVtyDtS1UcYt2q4Wl1JcyJywV6zZ3nzPXEBQG31jEwjpjjqJc3uWEC+5eicTAIAMnH2fpxm1mZz5i8LFTfOXV71BZXKOwvM3y3C2C5RX2Kuusby5jO3anfn7BTTqWDkfnycFE67AqGCKjmGqWmTANfqmQZKMVcuJYgeH8APcnnoTsFEP2BNbJCdbquzRv3ePqyi1Iuuxu3Gdm7TpGNCKduvwly9OjfoY5LB9dk0Bg20myHWlKoeapbJylUoX13W1Gi8vUVlcY9uIMzNwmc2WW9+7OEEwUmBo/RXl7Dd/4KFGYL2lJqSPZNL3lwfRcFixjqDgeNTvBrZrPaiPgcj5BvRlyY2EJr7RDcqNEqbjEjzevcWJyilNDkwRzc6y1y9jKwZh9EfIltiNydH/yPGit9C5sIrRxSAZ1XGWRCA1T6SQlksyX2tSbPld31nnx9HmMUdjzS8xuzDLbKOIoG/2FMUpPHf3MQiv7kTc9KSsoY6g7His6RaZZA1E0yz7HM8doxrOsVXf5zemnub29S61aRjWqzOytoZTdHyz5YiAfAPqIpewRgzpoNpw0x3XEUssnSGYZaiSI3AwvnZrm7vo68606u9VNqoQ0ibBQh2/4XJCmJ5rmcyZTdwHo0rlfBTqsGEQJs06ajEpwr7HH7bBOTXvc36lwp7bH4s4KlsRY1T5t7WMdYX49EnW/d4nd7y7L0VT2gpV9VxnBNoY9y2E+Cpi2Y1SCEvd0jIAG5VaJQa/ArggLzS2UHBoTR4OUz4xgjz9q+pYwOWoQ0X3poU1HeS+7ceq4xCWFZULWGtsMeKNEEmfJL7KnmzhYaGV63Nej5kSPbf3AXFEHwHpkkphHqZmukd7rCUEFw11ROJIk5gwzlZpCG5tiuMsdfx0bQYv5cnZ+jytojEZ1f4Ch46l3wiv9YI08ZPQeXMbgiDAnAQumgotGa4NvmnzQXqRpQkTUIZMPGvzdsQ1g1EEd70bUGPA8D7sjoEyfKd5hTD30h0GXlD4De9/mtsTimqmhg7s84Sjebs2yY+q44vQvlT1irX8uy8F4vVeiKOLSkxcQJzNtuoweojAPZal5RGbJA2uYAmIoqgQ4ovYbNznqD6IewSb94/VUJ2M0nufxf1DUJuKKFce0AAAAAElFTkSuQmCC';
    var AI_SERVER_URLS = [
        'https://ds-l013ue9b--7077.us-east-1.prod.proxy.devspaces.amazon.dev',
        'https://ds-c9x9n6fd--7077.us-east-1.prod.proxy.devspaces.amazon.dev'
    ];

    // ═══════════════════════════════════════════════════════════════════════════
    // INBOUND (ported 1:1 from Hydra) — Stage 2a: foundation (constants, state,
    // trace helpers, auth/fetch layer). Code transplanted verbatim from Hydra.user.js.
    // ═══════════════════════════════════════════════════════════════════════════
    var DEFAULT_NODE = 'ORD9';
    var IB_ALL_STATUSES = new Set(['UNLOADING_IN_PROGRESS', 'READY_FOR_UNLOAD', 'UNLOADING_PAUSED', 'LOAD_ARRIVED', 'IN_TRANSIT', 'SCHEDULED', 'COMPLETED']);

    // Auth/token state
    var csrfToken = null, tokenFetchedAt = null, isLoading = false;
    var sspToken = null, sspTokenFetchedAt = 0;  // separate anti-csrf token for SSP POST endpoints

    // Trace helpers (verbatim from Hydra)
    var _hydraTraceActive = {};
    var _hydraTraceId = 0;
    function hydraTraceStart(label, meta) {
        var id = ++_hydraTraceId;
        var startMs = performance.now();
        _hydraTraceActive[id] = { label: label, startMs: startMs };
        console.log('[Hydra TRACE ' + id + '] START ' + label + (meta ? ' ' + JSON.stringify(meta) : ''));
        _hydraTraceActive[id].stallTimer = setTimeout(function() {
            if (_hydraTraceActive[id]) console.warn('[Hydra TRACE ' + id + '] STALL ' + label + ' still running after 30s');
        }, 30000);
        return id;
    }
    function hydraTraceEnd(id, meta) {
        var entry = _hydraTraceActive[id];
        if (!entry) { console.warn('[Hydra TRACE ' + id + '] END called but no active entry'); return; }
        var dur = (performance.now() - entry.startMs).toFixed(0);
        if (entry.stallTimer) clearTimeout(entry.stallTimer);
        console.log('[Hydra TRACE ' + id + '] END   ' + entry.label + ' (' + dur + 'ms)' + (meta ? ' ' + JSON.stringify(meta) : ''));
        delete _hydraTraceActive[id];
    }
    function hydraTraceFail(id, err) {
        var entry = _hydraTraceActive[id];
        if (!entry) return;
        var dur = (performance.now() - entry.startMs).toFixed(0);
        if (entry.stallTimer) clearTimeout(entry.stallTimer);
        console.error('[Hydra TRACE ' + id + '] FAIL  ' + entry.label + ' (' + dur + 'ms)', err);
        delete _hydraTraceActive[id];
    }

    // Status line writer — targets the inbound header status element (guarded)
    function setStatus(msg) {
        var el = document.getElementById('he-ib-status');
        if (el) el.textContent = msg;
    }

    // Generic Vista fetch (CSRF token in header for POSTs). Verbatim from Hydra.
    function gmFetch(url, method, body) {
        method = method || 'GET';
        var _trId = hydraTraceStart('gmFetch ' + method + ' ' + url.slice(0, 100));
        var _timedOut = false;
        return new Promise(function(resolve, reject) {
            var _headers = body
                ? { 'anti-csrftoken-a2z': csrfToken, 'Content-Type': 'application/x-www-form-urlencoded' }
                : {};
            GM_xmlhttpRequest({
                method: method, url: url,
                headers: _headers,
                data: body || null, withCredentials: true,
                onload: function(r) {
                    if (_timedOut) return;
                    if (r.status !== 200) {
                        var safeBody = (r && r.responseText && typeof r.responseText === 'string') ? r.responseText.slice(0, 500) : '(no response body)';
                        hydraTraceFail(_trId, 'HTTP ' + r.status);
                        console.error('[Hydra] HTTP ' + r.status + ' on ' + url + '\n' + safeBody);
                        reject('HTTP ' + r.status);
                        return;
                    }
                    hydraTraceEnd(_trId, { status: r.status, bytes: r.responseText ? r.responseText.length : 0 });
                    try { resolve(JSON.parse(r.responseText)); } catch (e) { reject('JSON parse error'); }
                },
                onerror: function(e) { if (!_timedOut) { hydraTraceFail(_trId, 'net-err'); reject(e); } },
            });
            setTimeout(function() {
                if (_hydraTraceActive[_trId]) {
                    _timedOut = true;
                    hydraTraceFail(_trId, 'client-timeout-60s');
                    reject('client-timeout-60s');
                }
            }, 60000);
        });
    }

    // SSP endpoints require their OWN anti-csrf token. Verbatim from Hydra.
    function fetchSspToken(force) {
        if (!force && sspToken && (Date.now() - sspTokenFetchedAt) < 900000) {
            return Promise.resolve(sspToken);
        }
        return new Promise(function(resolve, reject) {
            GM_xmlhttpRequest({
                method: 'GET', url: 'https://trans-logistics.amazon.com/ssp/dock/hrz/ob', withCredentials: true,
                onload: function(r) {
                    var html = r.responseText || '';
                    var m = html.match(/name=['"]anti-csrftoken-a2z['"]\s+value=['"]([^'"]*)['"]/);
                    if (!m) m = html.match(/value=['"]([^'"]*)['"]\s+name=['"]anti-csrftoken-a2z['"]/);
                    var tok = m ? m[1] : null;
                    if (!tok || tok.length < 5) {
                        console.error('[Hydra] SSP token not found in /ssp/dock/hrz/ob (len=' + html.length + ')');
                        reject('SSP token not found'); return;
                    }
                    sspToken = tok;
                    sspTokenFetchedAt = Date.now();
                    console.log('[Hydra] sspToken set, length=' + sspToken.length);
                    resolve(sspToken);
                },
                onerror: function() { reject('SSP token fetch error'); },
                ontimeout: function() { reject('SSP token fetch timeout'); }
            });
        });
    }

    // POST to an SSP endpoint using the SSP-specific token. Verbatim from Hydra.
    function gmFetchSsp(url, body) {
        return fetchSspToken(false).then(function(tok) {
            return new Promise(function(resolve, reject) {
                GM_xmlhttpRequest({
                    method: 'POST', url: url,
                    headers: { 'anti-csrftoken-a2z': tok, 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'X-Requested-With': 'XMLHttpRequest' },
                    data: body || null, withCredentials: true,
                    onload: function(r) {
                        if (r.status !== 200) {
                            console.error('[Hydra] SSP POST HTTP ' + r.status + ' on ' + url);
                            reject('HTTP ' + r.status); return;
                        }
                        try { resolve(JSON.parse(r.responseText)); }
                        catch (e) { reject('SSP JSON parse error'); }
                    },
                    onerror: function() { reject('SSP POST error'); },
                    ontimeout: function() { reject('SSP POST timeout'); }
                });
            });
        });
    }

    // Vista CSRF token scrape. Verbatim from Hydra.
    function fetchToken() {
        var _tokTrace = hydraTraceStart('fetchToken');
        var _tokTimedOut = false;
        return new Promise(function(resolve, reject) {
            GM_xmlhttpRequest({
                method: 'GET', url: 'https://trans-logistics.amazon.com/sortcenter/vista', withCredentials: true,
                onload: function(r) {
                    if (_tokTimedOut) return;
                    var bodyLen = r.responseText ? r.responseText.length : 0;
                    var html = r.responseText || '';
                    var m = html.match(/name=['"]anti-csrftoken-a2z['"]\s+value=['"]([^'"]*)['"]/);
                    if (!m) m = html.match(/value=['"]([^'"]*)['"]\s+name=['"]anti-csrftoken-a2z['"]/);
                    var tokenFound = m ? m[1] : null;
                    if (!tokenFound) {
                        hydraTraceFail(_tokTrace, { reason: 'token-not-in-html', status: r.status, bodyLen: bodyLen, snippet: html.slice(0, 200) });
                        console.error('[Hydra] CSRF token regex did not match SSP HTML. Page length=' + bodyLen);
                        reject('Token not found'); return;
                    }
                    if (tokenFound.length < 5) {
                        hydraTraceFail(_tokTrace, { reason: 'token-too-short', status: r.status, bodyLen: bodyLen, tokenLen: tokenFound.length });
                        console.error('[Hydra] SSP returned empty CSRF token. Try reloading the page or running mwinit.');
                        reject('Token empty (SSP degraded)'); return;
                    }
                    csrfToken = tokenFound;
                    tokenFetchedAt = Date.now();
                    hydraTraceEnd(_tokTrace, { status: r.status, bodyLen: bodyLen, tokenLen: csrfToken.length, tokenPreview: csrfToken.slice(0, 12) });
                    console.log('[Hydra] csrfToken set, length=' + csrfToken.length);
                    window.__hydraCsrfToken = csrfToken;
                    resolve(csrfToken);
                },
                onerror: function(e) { if (!_tokTimedOut) { hydraTraceFail(_tokTrace, 'net-err'); reject(e); } },
            });
            setTimeout(function() {
                if (_hydraTraceActive[_tokTrace]) {
                    _tokTimedOut = true;
                    hydraTraceFail(_tokTrace, 'client-timeout-60s');
                    reject('client-timeout-60s');
                }
            }, 60000);
        });
    }
    // ═══════════════════════════════════════════════════════════════════════════
    // END INBOUND Stage 2a
    // ═══════════════════════════════════════════════════════════════════════════

    // ═══════════════════════════════════════════════════════════════════════════
    // INBOUND Stage 2b — data pipeline (load IDs, counts, summarizers, ETAs,
    // row build). Transplanted verbatim from Hydra; optional OB-route / yard-TDR
    // enrichers are typeof-guarded pending their own sub-stages.
    // ═══════════════════════════════════════════════════════════════════════════
    var SEARCH_WINDOW = 12;
    var BATCH_SIZE = 50;
    var ETA_CONCURRENCY = 1;
    var ETA_INTERCALL_GAP_MS = 0;
    var ETA_SAT_WINDOW_MS = 6 * 60 * 60 * 1000;
    var tzOverride = null; // set by settings later; null = browser TZ

    var IB_COLS = [
        { key: 'equip', label: '', type: 'str' },
        { key: 'vrid', label: 'VRID', type: 'str' },
        { key: 'route', label: 'Route', type: 'str' },
        { key: 'status', label: 'Status', type: 'str' },
        { key: 'location', label: 'Door', type: 'str' },
        { key: 'progress', label: 'Progress', type: 'num' },
        { key: 'total', label: 'Total', type: 'num' },
        { key: 'sortable', label: 'Sortable', type: 'num' },
        { key: 'crossdock', label: 'Cross Dock', type: 'num' },
        { key: 'cpt', label: 'CPT Pkgs', type: 'num' },
        { key: 'nextCpt', label: 'Next CPT', type: 'num' },
        { key: 'extraSmall', label: 'Extra Small', type: 'num' },
        { key: 'small', label: 'Small', type: 'num' },
        { key: 'medium', label: 'Medium', type: 'num' },
        { key: 'large', label: 'Large', type: 'num' },
        { key: 'extraLarge', label: 'Extra Large', type: 'num' },
        { key: 'noncon', label: 'Non-Con', type: 'num' },
        { key: 'ncCpt', label: 'NC CPT', type: 'num' },
        { key: 'containers', label: 'Containers', type: 'num' },
        { key: 'fluid', label: 'Fluid', type: 'num' },
        { key: 'containerized', label: 'Containerized', type: 'num' },
        { key: 'projFinish', label: 'Proj Finish', type: 'str' },
        { key: 'sat', label: 'SAT', type: 'str' },
        { key: 'aat', label: 'AAT', type: 'str' },
        { key: 'eta', label: 'ETA', type: 'str' },
    ];
    var IB_DEFAULT_VISIBLE = new Set([
        'equip','vrid','route','status','location','progress','total','sortable',
        'crossdock','cpt','noncon','containers','fluid','containerized','sat','aat','eta'
    ]);
    var IB_ALWAYS_VISIBLE = new Set(['equip','vrid']);
    var IB_COPYABLE_COLS = [
        {key:'total', label:'Total'}, {key:'sortable', label:'Sortable'}, {key:'crossdock', label:'Cross Dock'},
        {key:'cpt', label:'CPT Pkgs'}, {key:'extraSmall', label:'Extra Small'}, {key:'small', label:'Small'},
        {key:'medium', label:'Medium'}, {key:'large', label:'Large'}, {key:'extraLarge', label:'Extra Large'},
        {key:'noncon', label:'Non-Con'}, {key:'ncCpt', label:'NC CPT'}, {key:'containers', label:'Containers'},
        {key:'fluid', label:'Fluid'}, {key:'containerized', label:'Containerized'}
    ];

    var ibTableData = [], ibActiveTab = 'ondock';
    var ibTrailerFilter = GM_getValue('he-ib-trailer-filter', 'all');
    var ibVisibleCols = new Set(IB_DEFAULT_VISIBLE), ibColOrder = IB_COLS.map(function(c) { return c.key; });

    function encodeToken(t) { return t.replace(/=/g, '%3D').replace(/\//g, '%2F').replace(/\+/g, '%2B'); }
    function getEffectiveTzOffset() {
        if (tzOverride !== null && !isNaN(tzOverride)) return tzOverride;
        return -new Date().getTimezoneOffset() / 60;
    }
    function fmtDate(d) {
        return ('0' + (d.getMonth() + 1)).slice(-2) + '/' + ('0' + d.getDate()).slice(-2) + '/' + d.getFullYear() + ' ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
    }
    function msToLocal(ms) {
        if (!ms) return '\u2014';
        var tzOff = getEffectiveTzOffset();
        var d = new Date(Number(ms) + tzOff * 3600000);
        return ('0' + (d.getUTCMonth() + 1)).slice(-2) + '/' + ('0' + d.getUTCDate()).slice(-2) + ' ' + ('0' + d.getUTCHours()).slice(-2) + ':' + ('0' + d.getUTCMinutes()).slice(-2);
    }
    function parseCptMs(str) {
        if (!str || !str.trim()) return null;
        var tzOff = getEffectiveTzOffset();
        var m = str.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})$/);
        if (m) {
            var ms = Date.UTC(+m[3], +m[1]-1, +m[2], +m[4], +m[5], 0) - tzOff * 3600000;
            return isNaN(ms) ? null : ms;
        }
        var MONTHS = {Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11};
        var m2 = str.trim().match(/^(\d{1,2})-(\w{3})-(\d{2})\s+(\d{1,2}):(\d{2})$/);
        if (m2) {
            var mo = MONTHS[m2[2]];
            if (mo === undefined) return null;
            var ms2 = Date.UTC(2000 + +m2[3], mo, +m2[1], +m2[4], +m2[5], 0) - tzOff * 3600000;
            return isNaN(ms2) ? null : ms2;
        }
        return null;
    }

    // Step 1: get load IDs from Vista getInboundLoadsIds
    function ibGetLoadIdsAt(nodeId, offsetHours) {
        var searchMs = Date.now() + offsetHours * 3600000;
        var jsonObj = JSON.stringify({
            nodeId: nodeId,
            searchTime: searchMs,
            entity: 'getInboundLoadIds',
            cpts: [],
            processingTime: searchMs,
            testmode: false,
            sortPlanDuration: SEARCH_WINDOW * 60,
            metricsData: false,
        });
        var body = 'anti-csrftoken-a2z=' + encodeToken(csrfToken) + '&jsonObj=' + encodeURIComponent(jsonObj);
        return gmFetch('https://trans-logistics.amazon.com/sortcenter/vista/controller/getInboundLoadsIds', 'POST', body).then(function(data) {
            var map = (data && data.ret &&
                       data.ret.getInboundLoadIdsOutput &&
                       data.ret.getInboundLoadIdsOutput.timeBasedLoadIdsMap) || {};
            return Object.values(map).reduce(function(a, v) { return a.concat(v); }, []);
        });
    }

    function classifyLoadByRoute(load) {
        var r = load && load.inboundRoute;
        if (!r || typeof r !== 'string') return 'unknown';
        return r.toUpperCase().indexOf('CART') !== -1 ? 'xd' : 'sortable';
    }
    function applyTrailerFilter(loads) {
        if (ibTrailerFilter === 'all') return loads;
        return loads.filter(function(l) {
            var c = classifyLoadByRoute(l);
            if (c === 'unknown') return true;
            return c === ibTrailerFilter;
        });
    }

    // Step 2a: package counts (box_type, crossdock, CPT)
    function ibGetPackageCounts(nodeId, loadIdObjs) {
        if (!loadIdObjs.length) return Promise.resolve([]);
        var out = [], searchMs = Date.now();
        var chains = [];
        for (var i = 0; i < loadIdObjs.length; i += BATCH_SIZE) {
            (function(batch) {
                chains.push(function() {
                    var jsonObj = JSON.stringify({
                        nodeId: nodeId,
                        searchTime: searchMs,
                        entity: 'getInboundCounts',
                        testmode: false,
                        sortPlanDuration: 0,
                        segmentToMeasureTypeList: { segmentId: 'HIGH_LEVEL_LOGICAL_COUNT', measureType: 'COUNT' },
                        containerTypeFilter: ['PACKAGE'],
                        loadIdList: batch,
                        additionalPropertyNameList: ['box_type', 'is_part_of_crossdock'],
                        box_type: ['EXTRA_SMALL', 'SMALL', 'MEDIUM', 'LARGE', 'EXTRA_LARGE', 'NC', 'NC_PLUS', 'HEAVY_BULKY', 'HEAVY_BULKY_PLUS'],
                    });
                    var body = 'anti-csrftoken-a2z=' + encodeToken(csrfToken) + '&jsonObj=' + encodeURIComponent(jsonObj);
                    return gmFetch('https://trans-logistics.amazon.com/sortcenter/vista/controller/getInboundCounts', 'POST', body)
                        .then(function(d) {
                            var rows = (d && d.ret && d.ret.getInboundCountsOutput && d.ret.getInboundCountsOutput.loadLevelDetailList) || [];
                            out = out.concat(rows);
                        })
                        .catch(function(e) { console.error('[Hydra] ibGetPackageCounts batch error:', e); });
                });
            })(loadIdObjs.slice(i, i + BATCH_SIZE));
        }
        return chains.reduce(function(p, fn) { return p.then(fn); }, Promise.resolve()).then(function() { return out; });
    }

    // Step 2b: container counts (fluid / containerized)
    function ibGetContainerCounts(nodeId, loadIdObjs) {
        if (!loadIdObjs.length) return Promise.resolve([]);
        var out = [], searchMs = Date.now();
        var chains = [];
        for (var i = 0; i < loadIdObjs.length; i += BATCH_SIZE) {
            (function(batch) {
                chains.push(function() {
                    var jsonObj = JSON.stringify({
                        nodeId: nodeId,
                        searchTime: searchMs,
                        entity: 'getInboundCounts',
                        loadIdList: batch,
                        segmentToMeasureTypeList: { measureType: 'COUNT' },
                        containerTypeFilter: ['PALLET', 'GAYLORD', 'BAG', 'CART', 'PACKAGE'],
                        additionalPropertyNameList: ['is_enclosed'],
                        basePropertyNameList: ['container_type', 'sort_center_id'],
                    });
                    var body = 'anti-csrftoken-a2z=' + encodeToken(csrfToken) + '&jsonObj=' + encodeURIComponent(jsonObj);
                    return gmFetch('https://trans-logistics.amazon.com/sortcenter/vista/controller/getInboundCounts', 'POST', body)
                        .then(function(d) {
                            var rows = (d && d.ret && d.ret.getInboundCountsOutput && d.ret.getInboundCountsOutput.loadLevelDetailList) || [];
                            out = out.concat(rows);
                        })
                        .catch(function(e) { console.error('[Hydra] ibGetContainerCounts batch error:', e); });
                });
            })(loadIdObjs.slice(i, i + BATCH_SIZE));
        }
        return chains.reduce(function(p, fn) { return p.then(fn); }, Promise.resolve()).then(function() { return out; });
    }

    // Step 3a: summarise package detail into counts
    function ibSummarizePackages(detail, cptStart, cptEnd) {
        var total = 0, remaining = 0, crossdock = 0, nc = 0, cptCount = 0, ncCpt = 0;
        var xs = 0, sm = 0, md = 0, lg = 0, xl = 0, ncOnly = 0, ncPlus = 0;
        var hasCpt = cptStart !== null || cptEnd !== null;
        var segs = [
            detail.processedCounts,
            detail.unmanifestedLoadedCount,
            detail.preFacilityCounts,
            detail.unmanifestedSlamCount,
            detail.unmanifestedPreSlamCount,
        ];
        segs.forEach(function(seg, idx) {
            if (!seg) return;
            (Array.isArray(seg) ? seg : [seg]).forEach(function(c) {
                if (!c || !c.flowUnitsMap) return;
                var qty = Number(c.flowUnitsMap.COUNT) || 0;
                var pm = c.propertyMap || {};
                total += qty;
                if (idx >= 1) {
                    remaining += qty;
                    if (pm.is_part_of_crossdock === true || pm.is_part_of_crossdock === 'true') crossdock += qty;
                    var isNC = pm.box_type === 'NC' || pm.box_type === 'NC_PLUS';
                    if (isNC) nc += qty;
                    if (pm.box_type === 'NC') ncOnly += qty;
                    else if (pm.box_type === 'NC_PLUS') ncPlus += qty;
                    if (hasCpt && pm.cpt) {
                        var p = Number(pm.cpt);
                        if ((cptStart === null || p >= cptStart) && (cptEnd === null || p <= cptEnd)) {
                            cptCount += qty;
                            if (isNC) ncCpt += qty;
                        }
                    }
                    if (pm.box_type === 'EXTRA_SMALL')  xs += qty;
                    else if (pm.box_type === 'SMALL')   sm += qty;
                    else if (pm.box_type === 'MEDIUM')  md += qty;
                    else if (pm.box_type === 'LARGE')   lg += qty;
                    else if (pm.box_type === 'EXTRA_LARGE') xl += qty;
                }
            });
        });
        return { total: total, remaining: remaining, crossdock: crossdock, nc: nc, cptCount: cptCount, ncCpt: ncCpt,
                 extraSmall: xs, small: sm, medium: md, large: lg, extraLarge: xl, ncOnly: ncOnly, ncPlus: ncPlus };
    }

    // Step 3b: summarise container detail
    function ibSummarizeContainers(detail) {
        var containers = 0, fluid = 0, containerized = 0;
        var segs = [
            detail.unmanifestedLoadedCount,
            detail.preFacilityCounts,
            detail.unmanifestedSlamCount,
            detail.unmanifestedPreSlamCount,
        ];
        segs.forEach(function(seg) {
            if (!seg) return;
            (Array.isArray(seg) ? seg : [seg]).forEach(function(c) {
                if (!c || !c.flowUnitsMap) return;
                var qty = Number(c.flowUnitsMap.COUNT) || 0;
                var ct  = c.propertyMap && c.propertyMap.container_type;
                var enc = c.propertyMap && c.propertyMap.is_enclosed;
                if (ct === 'GAYLORD' || ct === 'PALLET' || ct === 'CART' || ct === 'BAG') containers += qty;
                if (ct === 'PACKAGE') { if (enc === false || enc === 'false') fluid += qty; else containerized += qty; }
            });
        });
        return { containers: containers, fluid: fluid, containerized: containerized };
    }

    function fetchSingleETA(vrid, nodeId) {
        return new Promise(function(resolve) {
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://trans-logistics.amazon.com/fmc/api/v2/execution/load/' + vrid,
                withCredentials: true,
                onload: function(r) {
                    if (r.status !== 200) { resolve({ vrid: vrid, eta: null }); return; }
                    try {
                        var data = JSON.parse(r.responseText);
                        if (!data || !data.timeline) { resolve({ vrid: vrid, eta: null }); return; }
                        var destStop = null;
                        for (var j = 0; j < data.timeline.length; j++) {
                            var ev = data.timeline[j];
                            if (ev.eventType === 'STOP' && ev.stepType === 'FUTURE') {
                                if (ev.title && ev.title.toUpperCase() === nodeId.toUpperCase()) { destStop = ev; break; }
                                if (!destStop) destStop = ev;
                            }
                        }
                        if (!destStop || !destStop.statusRollUps) { resolve({ vrid: vrid, eta: null }); return; }
                        for (var k = 0; k < destStop.statusRollUps.length; k++) {
                            var ru = destStop.statusRollUps[k];
                            if (ru.localizableDescription && ru.localizableDescription.translationKey === 'fmc_estimated_arrival') {
                                var ms = ru.timeAndFacilityTimeZone && ru.timeAndFacilityTimeZone.utcMillis;
                                resolve({ vrid: vrid, eta: ms || null });
                                return;
                            }
                        }
                        resolve({ vrid: vrid, eta: null });
                    } catch(e) { resolve({ vrid: vrid, eta: null }); }
                },
                onerror: function() { resolve({ vrid: vrid, eta: null }); }
            });
        });
    }

    function fetchETAs(nodeId, loads) {
        if (!ibVisibleCols.has('eta')) return Promise.resolve({});
        var nowMs = Date.now();
        var windowEndMs = nowMs + ETA_SAT_WINDOW_MS;
        var scheduled = loads.filter(function(l) {
            if (l.status !== 'SCHEDULED' || !l.displayId) return false;
            if (!l.sat) return false;
            return l.sat <= windowEndMs;
        });
        if (!scheduled.length) return Promise.resolve({});
        var tStart = Date.now();
        setStatus('Fetching ETAs (' + scheduled.length + ' scheduled, sequential)...');
        var results = new Array(scheduled.length);
        var nextIdx = 0;
        var completed = 0;
        return new Promise(function(done) {
            function worker() {
                if (nextIdx >= scheduled.length) {
                    if (completed === scheduled.length) finish();
                    return;
                }
                var myIdx = nextIdx++;
                var load = scheduled[myIdx];
                fetchSingleETA(load.displayId, nodeId).then(function(r) {
                    results[myIdx] = r;
                    completed++;
                    if (completed % 25 === 0 || completed === scheduled.length) {
                        setStatus('Fetching ETAs (' + completed + '/' + scheduled.length + ')...');
                    }
                    setTimeout(worker, ETA_INTERCALL_GAP_MS);
                });
            }
            function finish() {
                var etaMap = {};
                results.forEach(function(r) { if (r && r.eta) etaMap[r.vrid] = r.eta; });
                done(etaMap);
            }
            var startN = Math.min(ETA_CONCURRENCY, scheduled.length);
            for (var i = 0; i < startN; i++) worker();
        });
    }

    // OB Routes enrichment (guarded: OB lane fetch ported in a later sub-stage)
    function enrichRowsWithObRoutes(rows) {
        if (!ibVisibleCols.has('obRoutes')) return Promise.resolve(rows);
        if (typeof fetchLaneContainerDataForVrid !== 'function') return Promise.resolve(rows);
        if (!rows || !rows.length) return Promise.resolve(rows);
        var targets = rows.filter(function(r){ return r && r.loadId && (r.crossdock || 0) > 0; });
        if (!targets.length) return Promise.resolve(rows);
        setStatus('Loading OB route breakdown (' + targets.length + ' XD VRIDs)...');
        var CONCURRENCY = 5;
        var idx = 0, active = 0;
        return new Promise(function(resolve) {
            function next() {
                if (idx >= targets.length && active === 0) { resolve(rows); return; }
                while (active < CONCURRENCY && idx < targets.length) {
                    var r = targets[idx++];
                    active++;
                    fetchLaneContainerDataForVrid(r.loadId, r.status)
                        .then(function(captured){ return function(laneData) {
                            var counts = {};
                            (laneData || []).forEach(function(ln){
                                var dest = ln.dest || '';
                                if (!dest) return;
                                counts[dest] = (counts[dest] || 0) + (Number(ln.total) || 0);
                            });
                            captured.obRouteCounts = counts;
                        };}(r))
                        .catch(function(captured){ return function(err) {
                            console.warn('[Hydra] OB route fetch failed for', captured.vrid, err);
                            captured.obRouteCounts = {};
                        };}(r))
                        .then(function(){ active--; next(); });
                }
            }
            next();
        });
    }

    // CPT+ enrichment (guarded: OB lane fetch ported in a later sub-stage)
    function enrichRowsWithCptPlus(rows) {
        if (!ibVisibleCols.has('cptPlus')) return Promise.resolve(rows);
        if (typeof fetchLaneDataForVrid !== 'function') return Promise.resolve(rows);
        if (!rows || !rows.length) return Promise.resolve(rows);
        var selRoutes = (typeof getSelectedObRoutes === 'function') ? getSelectedObRoutes() : [];
        function destSelected(dest) {
            if (!dest) return false;
            if (!selRoutes.length) return true;
            if (typeof routeMatchesList === 'function') return routeMatchesList(dest, selRoutes);
            return selRoutes.indexOf(dest) !== -1;
        }
        var targets = rows.filter(function(r){ return r && r.loadId; });
        if (!targets.length) return Promise.resolve(rows);
        setStatus('Loading CPT+ (OB-route) breakdown (' + targets.length + ' VRIDs)...');
        var CONCURRENCY = 5;
        var idx = 0, active = 0;
        return new Promise(function(resolve) {
            function next() {
                if (idx >= targets.length && active === 0) { resolve(rows); return; }
                while (active < CONCURRENCY && idx < targets.length) {
                    var r = targets[idx++];
                    active++;
                    fetchLaneDataForVrid(r.loadId, r.status)
                        .then(function(captured){ return function(laneData) {
                            var sum = 0;
                            (laneData || []).forEach(function(ln){
                                if (destSelected(ln.dest)) sum += (Number(ln.cptRemaining) || 0);
                            });
                            captured.cptPlus = sum;
                        };}(r))
                        .catch(function(captured){ return function(err) {
                            console.warn('[Hydra] CPT+ fetch failed for', captured.vrid, err);
                            captured.cptPlus = 0;
                        };}(r))
                        .then(function(){ active--; next(); });
                }
            }
            next();
        });
    }

    function applyIbEtas(etaMap, targetRows) {
        var _arr = Array.isArray(targetRows) ? targetRows : ibTableData;
        if (!Array.isArray(_arr)) return;
        etaMap = etaMap || {};
        _arr.forEach(function(r) {
            if (r.status !== 'SCHEDULED' || !r.vrid) return;
            var etaMsVal = 0;
            if (r.total > 0 && etaMap[r.vrid]) {
                etaMsVal = Number(etaMap[r.vrid]) || 0;
                if (etaMsVal && (etaMsVal - Date.now()) < -30 * 60 * 1000) etaMsVal = 0;
            }
            r.etaMs = etaMsVal;
            r.eta = etaMsVal ? '' : '\u2014';
            r.displayStatus = etaMsVal ? 'MANIFESTED' : (r.status || '\u2014');
        });
    }

    // Main IB fetch + build. Transplanted from Hydra; yard/TDR enricher guarded.
    function fetchAndBuildIB(onPatch, deferEta) {
        var node       = (document.getElementById('he-ib-node-input') ? (document.getElementById('he-ib-node-input').value || DEFAULT_NODE) : DEFAULT_NODE).toUpperCase();
        var startDays  = parseInt(document.getElementById('he-ib-start-input') ? document.getElementById('he-ib-start-input').value : '0') || 0;
        var endDays    = parseInt(document.getElementById('he-ib-end-input') ? document.getElementById('he-ib-end-input').value : '0') || 0;
        var cptStartMs = parseCptMs(document.getElementById('he-ib-cpt-start-input') ? document.getElementById('he-ib-cpt-start-input').value : '');
        var cptEndMs   = parseCptMs(document.getElementById('he-ib-cpt-end-input') ? document.getElementById('he-ib-cpt-end-input').value : '');

        var startHrs = startDays * 24;
        var endHrs   = endDays   * 24;

        var offsets = {};
        offsets[0] = true;
        for (var h = startHrs; h <= 0; h += 24)  offsets[h] = true;
        for (var h2 = 0; h2 <= endHrs; h2 += 24) offsets[h2] = true;
        var offsetArr = Object.keys(offsets).map(Number);

        setStatus('Loading trailer IDs...');

        var loadMap = {};
        var chain = offsetArr.reduce(function(p, offset) {
            return p.then(function() {
                return ibGetLoadIdsAt(node, offset).then(function(loads) {
                    loads.forEach(function(l) { if (!loadMap[l.loadId]) loadMap[l.loadId] = l; });
                }).catch(function(e) {
                    console.error('[Hydra] ibGetLoadIdsAt offset=' + offset + ' failed:', e);
                });
            });
        }, Promise.resolve());

        return chain.then(function() {
            var loads = Object.values(loadMap).filter(function(l) { return IB_ALL_STATUSES.has(l.status); });
            if (!loads.length) return [];
            loads = applyTrailerFilter(loads);
            if (!loads.length) return [];

            setStatus('Loading counts (' + loads.length + ' trailers)...');

            var loadIdObjs = loads.map(function(l) {
                return { loadId: l.loadId, isRolledOver: l.isRolledOver || false, sat: l.sat, status: l.status, displayId: l.displayId, aat: l.aat };
            });
            var pkgP = ibGetPackageCounts(node, loadIdObjs);
            var ctnP = ibGetContainerCounts(node, loadIdObjs);
            var hasScheduled = loads.some(function(l) { return l.status === 'SCHEDULED'; });
            var paP;
            if (typeof sesameEnabled !== 'undefined' && sesameEnabled && ibVisibleCols.has('location') && hasScheduled && typeof fetchSesamePreAssignments === 'function') {
                paP = fetchSesamePreAssignments(node).then(function(x){ return x || {}; }, function(){ return {}; });
            } else {
                paP = Promise.resolve({});
            }
            return Promise.all([pkgP, ctnP, paP]).then(function(results) {
                var pkgMap = {}, ctnMap = {}, paMap = results[2] || {};
                if (typeof sesamePaDoorInfo !== 'undefined') sesamePaDoorInfo = {};
                results[0].forEach(function(e) { pkgMap[e.loadId] = ibSummarizePackages(e, cptStartMs, cptEndMs); });
                var nextCptMap = {};
                var _nextWin = (function() {
                    if (typeof selectedCptIds === 'undefined' || typeof cptWindows === 'undefined') return null;
                    if (!selectedCptIds.length || !cptWindows.length) return null;
                    var selIdx = cptWindows.reduce(function(max, w, i) { return selectedCptIds.indexOf(w.id) !== -1 ? Math.max(max, i) : max; }, -1);
                    var nextW = cptWindows[selIdx + 1];
                    if (!nextW) return null;
                    var today = new Date(); today.setHours(nextW.startH, nextW.startM, 0, 0);
                    var end = new Date(); end.setHours(nextW.endH, nextW.endM, 0, 0);
                    if (nextW.endPlusDay) end.setDate(end.getDate() + 1);
                    if (nextW.startPlusDay) today.setDate(today.getDate() + 1);
                    return { start: today.getTime(), end: end.getTime() };
                })();
                if (_nextWin) results[0].forEach(function(e) { nextCptMap[e.loadId] = ibSummarizePackages(e, _nextWin.start, _nextWin.end).cptCount; });
                results[1].forEach(function(e) { ctnMap[e.loadId] = ibSummarizeContainers(e); });

                return loads.map(function(l) {
                    var pkg = pkgMap[l.loadId] || { total: 0, remaining: 0, crossdock: 0, nc: 0, cptCount: 0, ncCpt: 0, extraSmall: 0, small: 0, medium: 0, large: 0, extraLarge: 0, ncOnly: 0, ncPlus: 0 };
                    pkg.nextCptCount = nextCptMap[l.loadId] || 0;
                    var ctn = ctnMap[l.loadId] || { containers: 0, fluid: 0, containerized: 0 };

                    var rd = (l.location && l.location.locationId != null) ? String(l.location.locationId) : '';
                    var ds = rd.toUpperCase().indexOf('DD') === 0 ? rd.slice(2) : rd;
                    var door = ds === '' ? '\u2014' : (isNaN(ds) ? ds : Number(ds));
                    var paDoorNum = null;
                    if (l.status === 'SCHEDULED' && l.displayId && paMap[l.displayId]) {
                        paDoorNum = paMap[l.displayId];
                        door = String(paDoorNum);
                    }

                    var rr = (l.inboundRoute && typeof l.inboundRoute === 'string') ? l.inboundRoute : '';
                    var route = rr ? (rr.toUpperCase().indexOf('CART') !== -1 ? rr.trim() : (rr.indexOf('->') !== -1 ? rr.split('->')[0].trim() : rr.trim())) : '\u2014';

                    if (paDoorNum != null && typeof sesamePaDoorInfo !== 'undefined') {
                        sesamePaDoorInfo[String(paDoorNum)] = { vrid: l.displayId || '', route: route };
                    }

                    var sortable = Math.max(0, pkg.remaining - pkg.crossdock);

                    var etaMsVal = 0;
                    var row = {
                        vrid:          l.displayId || '\u2014',
                        loadId:        l.loadId,
                        status:        l.status || '\u2014',
                        displayStatus: l.status || '\u2014',
                        location:      String(door),
                        equipType:     l.equipmentType || '',
                        route:         route,
                        total:         pkg.total,
                        remaining:     pkg.remaining,
                        sortable:      sortable,
                        crossdock:     pkg.crossdock,
                        cpt:           pkg.cptCount,
                        nextCpt:       pkg.nextCptCount || 0,
                        noncon:        pkg.nc,
                        ncCpt:         pkg.ncCpt,
                        extraSmall:    pkg.extraSmall,
                        small:         pkg.small,
                        medium:        pkg.medium,
                        large:         pkg.large,
                        extraLarge:    pkg.extraLarge,
                        ncOnly:        pkg.ncOnly || 0,
                        ncPlus:        pkg.ncPlus || 0,
                        containers:    ctn.containers,
                        fluid:         ctn.fluid,
                        containerized: ctn.containerized,
                        sat:           l.sat  ? msToLocal(l.sat)  : '\u2014',
                        aat:           l.aat  ? msToLocal(l.aat)  : '\u2014',
                        eta:           '\u2014',
                        satMs:         l.sat  || 0,
                        aatMs:         l.aat  || 0,
                        etaMs:         etaMsVal,
                        fluidPct:      0,
                        containerizedPct: 0,
                        isPA:          paDoorNum != null,
                        paDoorNum:     paDoorNum,
                    };
                    if (row.total > 0) {
                        row.fluidPct         = Math.round((row.fluid         / row.total) * 100);
                        row.containerizedPct = Math.round((row.containerized / row.total) * 100);
                    }
                    return row;
                });
            }).then(function(rows) {
                function _patch() { if (typeof onPatch === 'function') { try { onPatch(); } catch(e){ console.warn('[Hydra] onPatch:', e); } } }
                function _yardTdr(targetRows) {
                    if (typeof fetchYardStateIfNeeded === 'function' && typeof enrichRowsWithTdrStatus === 'function') {
                        return fetchYardStateIfNeeded().then(function(){ return enrichRowsWithTdrStatus(targetRows); });
                    }
                    return Promise.resolve(targetRows);
                }
                if (deferEta) {
                    var _etaPD = fetchETAs(node, loads).then(function(etaMap) { applyIbEtas(etaMap || {}, rows); }, function(){});
                    var _obrPD = enrichRowsWithObRoutes(rows).then(function(){ return enrichRowsWithCptPlus(rows); }).then(null, function(e){ console.warn('[Hydra] enrich obRoutes/cptPlus:', e); });
                    var _yrdPD = _yardTdr(rows).then(null, function(e){ console.warn('[Hydra] yard/TDR:', e); });
                    return Promise.all([_etaPD, _obrPD, _yrdPD]).then(function(){ return rows; });
                }
                fetchETAs(node, loads).then(function(etaMap) {
                    applyIbEtas(etaMap || {}); _patch();
                    var _n = Array.isArray(ibTableData) ? ibTableData.length : 0;
                    setStatus('\u2714 ' + _n + ' inbound loads (ETAs loaded) \u2014 ' + new Date().toLocaleTimeString());
                }, function(){});
                enrichRowsWithObRoutes(rows).then(function(){ _patch(); return enrichRowsWithCptPlus(rows); }).then(function(){ _patch(); }, function(e){ console.warn('[Hydra] enrich obRoutes/cptPlus:', e); });
                _yardTdr(rows).then(function(){ _patch(); }, function(e){ console.warn('[Hydra] yard/TDR:', e); });
                return rows;
            });
        });
    }
    // ═══════════════════════════════════════════════════════════════════════════
    // END INBOUND Stage 2b
    // ═══════════════════════════════════════════════════════════════════════════

    // ═══════════════════════════════════════════════════════════════════════════
    // INBOUND Stage 2c — CPT system, tab/sort/filter state, cell/route/progress
    // helpers. Transplanted from Hydra; input IDs adapted to he-ib-*, OB/PS
    // re-render calls reduced to the IB path.
    // ═══════════════════════════════════════════════════════════════════════════
    var IB_STORAGE = { cptWindows: 'he_cpt_windows_v1' };

    var IB_TABS = [
        { id: 'all',       label: 'All',        statuses: null },
        { id: 'arrived',   label: 'Arrived',    statuses: new Set(['UNLOADING_IN_PROGRESS', 'READY_FOR_UNLOAD', 'UNLOADING_PAUSED', 'LOAD_ARRIVED', 'IN_TRANSIT', 'COMPLETED']) },
        { id: 'ondock',    label: 'At Dock',    statuses: new Set(['UNLOADING_IN_PROGRESS', 'READY_FOR_UNLOAD', 'UNLOADING_PAUSED']) },
        { id: 'yard',      label: 'Yard',       statuses: new Set(['LOAD_ARRIVED', 'IN_TRANSIT']) },
        { id: 'scheduled', label: 'Scheduled',  filter: function(r) { return r.displayStatus === 'SCHEDULED'; } },
        { id: 'manifested',label: 'Manifested', filter: function(r) { return r.displayStatus === 'MANIFESTED'; } },
        { id: 'completed', label: 'Completed',  statuses: new Set(['COMPLETED']) },
    ];

    var DEFAULT_CPT_WINDOWS = [
        { id: 'day', label: 'DAY', startH: 12, startM: 0, endH: 15, endM: 0, bgColor: '#5c1a3a', textColor: '#ffb0d0' },
        { id: 'twi', label: 'TWI', startH: 17, startM: 0, endH: 21, endM: 0, bgColor: '#1a4731', textColor: '#a5d6a7' },
        { id: 'nit', label: 'NIT', startH: 23, startM: 0, endH: 3,  endM: 0, bgColor: '#1a2a4a', textColor: '#90caf9' },
        { id: 'mor', label: 'MOR', startH: 5,  startM: 0, endH: 9,  endM: 0, bgColor: '#7f2000', textColor: '#ffcc80' },
    ];
    var cptWindows = DEFAULT_CPT_WINDOWS.map(function(w) { return Object.assign({}, w); });
    var selectedCptIds = [];
    var cptSlaHours = 4, cptSlaEnabled = true;

    var ibTabSort = { all: {key:'cpt',dir:-1}, arrived: {key:'cpt',dir:-1}, ondock: {key:'cpt',dir:-1}, yard: {key:'cpt',dir:-1}, scheduled: {key:'sat',dir:1}, manifested: {key:'eta',dir:1}, completed: {key:'aat',dir:-1} };
    function getIbSort() { return ibTabSort[ibActiveTab] || (ibTabSort[ibActiveTab] = {key:'cpt',dir:-1}); }
    var ibFilterText = '', ibFilterXD = (ibTrailerFilter === 'xd'), ibFilterSortable = (ibTrailerFilter === 'sortable');

    function getIBFiltered(tabId) {
        var tab = IB_TABS.find(function(t) { return t.id === tabId; });
        var rows = ibTableData.filter(function(r) {
            if (tab && tab.statuses && !tab.statuses.has(r.status)) return false;
            if (tab && tab.filter && !tab.filter(r)) return false;
            return true;
        });
        if (ibFilterXD)       rows = rows.filter(function(r) { return r.route.toUpperCase().indexOf('CART') !== -1; });
        if (ibFilterSortable) rows = rows.filter(function(r) { return r.route.toUpperCase().indexOf('CART') === -1; });
        if (ibFilterText) {
            var txt = ibFilterText.toLowerCase();
            rows = rows.filter(function(r) {
                var door          = r.location != null ? String(r.location).toLowerCase() : '';
                var displayStatus = (r.displayStatus || r.status || '').toLowerCase();
                return String(r.vrid).toLowerCase().indexOf(txt)  !== -1 ||
                       String(r.route).toLowerCase().indexOf(txt) !== -1 ||
                       displayStatus.indexOf(txt) !== -1 ||
                       door.indexOf(txt)          !== -1;
            });
        }
        return rows;
    }

    function cptToMinutes(cptStr) {
        if (!cptStr || cptStr === '\u2014') return null;
        var m = cptStr.trim().match(/(\d{1,2}):(\d{2})\s*$/);
        if (!m) return null;
        return Number(m[1]) * 60 + Number(m[2]);
    }
    function isCptInWindow(cptStr) {
        var startEl = document.getElementById('he-ib-cpt-start-input');
        var endEl   = document.getElementById('he-ib-cpt-end-input');
        var startVal = startEl ? startEl.value.trim() : '';
        var endVal   = endEl   ? endEl.value.trim()   : '';
        if (!startVal && !endVal) return true;
        var cptMs = parseCptMs(cptStr);
        if (cptMs === null) return false;
        var startMs = parseCptMs(startVal);
        var endMs   = parseCptMs(endVal);
        if (startMs !== null && cptMs < startMs) return false;
        if (endMs   !== null && cptMs > endMs)   return false;
        return true;
    }
    function routeMatchesList(route, list) {
        if (!route || !list || !list.length) return false;
        var r = route.toUpperCase();
        return list.some(function(p) { return r.indexOf(p.toUpperCase()) !== -1; });
    }
    function cptWindowColor(cptStr) {
        var t = cptToMinutes(cptStr);
        if (t === null) return null;
        for (var i = 0; i < cptWindows.length; i++) {
            var w = cptWindows[i];
            var s = w.startH * 60 + (w.startM || 0);
            var e = w.endH   * 60 + (w.endM   || 0);
            var inWindow = (e <= s) ? (t >= s || t <= e) : (t >= s && t <= e);
            if (inWindow) {
                return { bg: w.bgColor || 'var(--h-bg4, #1a2535)', text: w.textColor || 'var(--h-text, var(--he-text))' };
            }
        }
        return null;
    }
    function routePill(route, cpt) {
        var c = cptWindowColor(cpt);
        if (!c) return route || '\u2014';
        return '<span style="background:' + c.bg + ';color:' + c.text + ';padding:2px 8px;border-radius:3px;font-weight:600;font-size:11px;border:1px solid var(--h-prog-border, rgba(255,255,255,0.08))">' + (route || '\u2014') + '</span>';
    }
    function cptCellHtml(v, noHeat) {
        v = v || 0;
        if (noHeat) return '<td style="padding:3px 10px;border-bottom:1px solid #2a2a2a">' + v + '</td>';
        var bg, color = '#fff', fw = ';font-weight:700', extra = '';
        if (v >= 200) { bg = '#b71c1c'; extra = ';box-shadow:inset 0 0 8px rgba(0,0,0,.4)'; }
        else if (v >= 100) { bg = '#c62828'; }
        else if (v >= 40) { bg = '#e65100'; }
        else if (v >= 10) { bg = '#f57f17'; color = '#111'; }
        else { bg = '#1b5e20'; fw = ''; }
        return '<td style="background:' + bg + ';color:' + color + fw + extra + ';border-radius:3px;padding:3px 10px;border:1px solid rgba(0,0,0,0.45)">' + v + '</td>';
    }
    function ncCptCellHtml(v, noHeat) {
        v = v || 0;
        if (noHeat) return '<td style="padding:3px 10px;border-bottom:1px solid #2a2a2a">' + v + '</td>';
        var bg, color = '#fff', fw = ';font-weight:700', extra = '';
        if      (v >= 200) { bg = '#b71c1c'; extra = ';box-shadow:inset 0 0 8px rgba(0,0,0,.4)'; }
        else if (v >= 100) { bg = '#c62828'; }
        else if (v >= 40)  { bg = '#e65100'; }
        else if (v >= 10)  { bg = '#f57f17'; color = '#111'; }
        else               { bg = '#1b5e20'; fw = ''; }
        return '<td style="background:' + bg + ';color:' + color + fw + extra + ';border-radius:3px;padding:3px 10px;border:1px solid rgba(0,0,0,0.45)">' + v + '</td>';
    }
    function ppcColorStyle(containerized, containers) {
        var c = Number(containers) || 0;
        if (c <= 0) return '';
        var ppc = (Number(containerized) || 0) / c;
        var _ppcLight = document.documentElement.classList.contains('hydra-light');
        var color, fw = 'font-weight:700';
        if (ppc < 50) { color = _ppcLight ? '#d32f2f' : '#ef5350'; }
        else if (ppc < 60) { color = _ppcLight ? '#e64a19' : '#ff7043'; }
        else if (ppc < 70) { color = _ppcLight ? '#ef6c00' : '#ffa726'; }
        else if (ppc < 80) { color = _ppcLight ? '#f9a825' : '#ffee58'; }
        else { color = _ppcLight ? '#2e7d32' : '#66bb6a'; }
        return 'color:' + color + ';' + fw;
    }
    function progressBarHtml(total, remaining) {
        var pct = (total > 0) ? Math.max(0, Math.min(100, Math.round(((total - remaining) / total) * 100))) : 0;
        var cls = pct < 10 ? 'prog-0' : pct < 25 ? 'prog-1' : pct < 50 ? 'prog-2' : pct < 75 ? 'prog-3' : 'prog-4';
        return '<td class="col-progress"><div class="prog-wrap"><div class="prog-bar ' + cls + '" style="width:' + pct + '%"></div><span class="prog-label">' + pct + '%</span></div></td>';
    }

    function saveCptWindows() { try { localStorage.setItem(IB_STORAGE.cptWindows, JSON.stringify(cptWindows)); } catch (e) {} }
    function loadCptWindows() {
        try {
            var raw = localStorage.getItem(IB_STORAGE.cptWindows);
            if (raw) { var arr = JSON.parse(raw); if (Array.isArray(arr) && arr.length > 0) cptWindows = arr; }
        } catch (e) {}
    }
    function getActiveCptPreset(h) {
        for (var i = 0; i < cptWindows.length; i++) {
            var w = cptWindows[i];
            if (w.endH < w.startH) { if (h >= w.startH || h < w.endH) return w.id; }
            else { if (h >= w.startH && h < w.endH) return w.id; }
        }
        return cptWindows.length > 0 ? cptWindows[0].id : null;
    }
    function getCptPresetDates(id) {
        var win = cptWindows.find(function(w) { return w.id === id; });
        if (!win) return { start: '', end: '' };
        var tzOff = getEffectiveTzOffset();
        var nowUtc = Date.now();
        var nowInTz = new Date(nowUtc + tzOff * 3600000);
        var yyyyTz = nowInTz.getUTCFullYear();
        var mmTz   = nowInTz.getUTCMonth();
        var ddTz   = nowInTz.getUTCDate();
        var hTz    = nowInTz.getUTCHours();
        var minTz  = nowInTz.getUTCMinutes();
        var startMs = Date.UTC(yyyyTz, mmTz, ddTz, win.startH, win.startM || 0, 0) - tzOff * 3600000;
        var endMs   = Date.UTC(yyyyTz, mmTz, ddTz, win.endH,   win.endM   || 0, 0) - tzOff * 3600000;
        if (win.startPlusDay) startMs += 86400000;
        if (win.endPlusDay)   endMs   += 86400000;
        if (!win.startPlusDay && !win.endPlusDay) {
            var isOvernight = win.endH < win.startH || (win.endH === win.startH && (win.endM || 0) < (win.startM || 0));
            if (isOvernight) {
                var pastEnd = (hTz < win.endH) || (hTz === win.endH && minTz < (win.endM || 0));
                if (pastEnd) startMs -= 86400000;
                else         endMs   += 86400000;
            }
        }
        function toDisplayStr(ms) {
            var d = new Date(ms + tzOff * 3600000);
            return ('0'+(d.getUTCMonth()+1)).slice(-2)+'/'+('0'+d.getUTCDate()).slice(-2)+'/'+d.getUTCFullYear()+' '+('0'+d.getUTCHours()).slice(-2)+':'+('0'+d.getUTCMinutes()).slice(-2);
        }
        return { start: toDisplayStr(startMs), end: toDisplayStr(endMs) };
    }
    function applyCptPreset(id) {
        var startEl = document.getElementById('he-ib-cpt-start-input');
        var endEl   = document.getElementById('he-ib-cpt-end-input');
        if (id === 'any') {
            if (startEl) startEl.value = '';
            if (endEl)   endEl.value   = '';
        } else {
            var d = getCptPresetDates(id);
            if (startEl) startEl.value = d.start;
            if (endEl)   endEl.value   = d.end;
        }
        if (typeof renderIBTabs === 'function') renderIBTabs();
        if (typeof renderIBTable === 'function') renderIBTable();
    }
    function buildCptOptions() {
        var activePresetId = getActiveCptPreset(new Date().getHours());
        var opts = '<option value="any">\u2014 Any \u2014</option>';
        opts += cptWindows.map(function(w) {
            var timeStr = ('0' + w.startH).slice(-2) + ':' + ('0' + (w.startM || 0)).slice(-2) +
                          '-' + ('0' + w.endH).slice(-2) + ':' + ('0' + (w.endM || 0)).slice(-2);
            var selected = w.id === activePresetId ? ' selected' : '';
            return '<option value="' + w.id + '"' + selected + '>' + w.label + '  ' + timeStr + '</option>';
        }).join('');
        return opts;
    }
    loadCptWindows();
    // ═══════════════════════════════════════════════════════════════════════════
    // END INBOUND Stage 2c
    // ═══════════════════════════════════════════════════════════════════════════

    // ═══════════════════════════════════════════════════════════════════════════
    // INBOUND Stage 2d — header controls, tabs, refresh orchestration.
    // Mounts into #he-ib-view. Table render (renderIBTable) lands in 2e.
    // ═══════════════════════════════════════════════════════════════════════════
    var ibViewBuilt = false;
    var ibSelectedIds = new Set();
    // Drag-select state (module-level, matches Hydra)
    var dragAnchor = null, dragCurrent = null, isDragging = false, autoScrollTimer = null;

    // Prune selected VRIDs no longer present after a refresh (verbatim from Hydra)
    function reconcileIbSelection() {
        if (!ibSelectedIds || ibSelectedIds.size === 0) return false;
        if (!Array.isArray(ibTableData)) return false;
        var present = new Set();
        ibTableData.forEach(function(r) { if (r && r.vrid != null) present.add(r.vrid); });
        var changed = false;
        Array.from(ibSelectedIds).forEach(function(v) {
            if (!present.has(v)) { ibSelectedIds.delete(v); changed = true; }
        });
        return changed;
    }

    function renderInboundView() {
        var host = document.getElementById('he-ib-view');
        if (!host) return;
        if (ibViewBuilt) return; // build once; refresh re-renders table only
        ibViewBuilt = true;

        var hour = new Date().getHours();
        var activePresetId = getActiveCptPreset(hour);
        var dates = getCptPresetDates(activePresetId);
        var inp = 'background:var(--he-bg);border:1px solid var(--he-border);border-radius:4px;color:var(--he-text);padding:3px 7px;font-size:12px;outline:none';

        host.innerHTML =
            '<div id="he-ib-header" style="display:flex;align-items:center;gap:8px;padding:6px 10px;border-bottom:1px solid var(--he-border);border-left:3px solid #cc1040;background:var(--he-panel);flex-wrap:wrap;flex-shrink:0">' +
                '<label style="color:var(--he-muted);font-size:11px">Site</label>' +
                '<input id="he-ib-node-input" style="' + inp + ';width:58px;text-transform:uppercase" value="' + (engineSettings.siteCode || DEFAULT_NODE) + '">' +
                '<input type="hidden" id="he-ib-start-input" value="0"><input type="hidden" id="he-ib-end-input" value="0">' +
                '<span style="width:1px;height:22px;background:var(--he-border)"></span>' +
                '<label style="color:var(--he-muted);font-size:11px">CPT</label>' +
                '<select id="he-ib-cpt-preset" style="' + inp + ';cursor:pointer;font-weight:700">' + buildCptOptions() + '</select>' +
                '<input id="he-ib-cpt-start-input" type="text" style="' + inp + ';width:132px" value="' + dates.start + '" placeholder="MM/DD/YYYY HH:MM">' +
                '<input id="he-ib-cpt-end-input" type="text" style="' + inp + ';width:132px" value="' + dates.end + '" placeholder="MM/DD/YYYY HH:MM">' +
                '<span style="width:1px;height:22px;background:var(--he-border)"></span>' +
                '<button id="he-ib-refresh-btn" style="border:none;border-radius:4px;padding:5px 13px;font-size:12px;font-weight:700;cursor:pointer;background:linear-gradient(135deg,#cc1040,#a00830);color:#fff">Refresh</button>' +
                '<span id="he-ib-status" style="font-size:11px;color:var(--he-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:320px;margin-left:auto;padding-right:4px"></span>' +
            '</div>' +
            '<div id="he-ib-search-bar" style="display:flex;align-items:center;gap:8px;padding:6px 14px;border-bottom:1px solid var(--he-border);background:var(--he-panel);flex-shrink:0;flex-wrap:wrap">' +
                '<input id="he-ib-search" type="text" placeholder="Search VRID, route, door, status..." style="' + inp + ';width:240px">' +
                '<button id="he-ib-search-clear" style="background:var(--he-bg);border:1px solid var(--he-border);border-radius:4px;color:var(--he-muted);padding:4px 9px;font-size:12px;cursor:pointer">\u2715</button>' +
                '<span id="he-ib-search-count" style="font-size:11px;color:var(--he-muted)"></span>' +
                '<span style="width:1px;height:20px;background:var(--he-border);margin:0 4px"></span>' +
                '<button class="he-ib-tfilter" data-tf="all" style="border-radius:4px;padding:4px 12px;font-size:12px;font-weight:700;cursor:pointer">All</button>' +
                '<button class="he-ib-tfilter" data-tf="sortable" style="border-radius:4px;padding:4px 12px;font-size:12px;font-weight:700;cursor:pointer">Sortable</button>' +
                '<button class="he-ib-tfilter" data-tf="xd" style="border-radius:4px;padding:4px 12px;font-size:12px;font-weight:700;cursor:pointer">XD</button>' +
            '</div>' +
            '<div id="he-ib-tabs" style="display:flex;align-items:center;flex-wrap:wrap;border-bottom:2px solid #cc1040;background:var(--he-panel);flex-shrink:0"></div>' +
            '<div id="he-ib-selbar" style="display:none;align-items:center;gap:14px;padding:5px 14px;border-bottom:1px solid #5c1030;background:var(--he-panel);font-size:12px;flex-shrink:0">' +
                '<span id="he-ib-sel-info" style="flex:1;min-width:0;color:var(--he-muted)"></span>' +
                '<button id="he-ib-export-plan" style="background:linear-gradient(135deg,#cc1040,#a00830);color:#fff;border:none;border-radius:4px;padding:5px 13px;font-size:12px;font-weight:700;cursor:pointer">Export To Plan</button>' +
                '<button id="he-ib-sel-clear" style="background:none;border:none;color:var(--he-muted);cursor:pointer;font-size:12px">Clear</button>' +
            '</div>' +
            '<div id="he-ib-table-wrap" style="overflow:auto;flex:1;min-height:0;user-select:none;font-size:12px;position:relative;background:var(--he-bg)"></div>';

        // Wire controls
        var cptSel = document.getElementById('he-ib-cpt-preset');
        if (cptSel) cptSel.addEventListener('change', function() { applyCptPreset(cptSel.value); });
        document.getElementById('he-ib-refresh-btn').addEventListener('click', function() { doIbRefresh(); });
        document.getElementById('he-ib-export-plan').addEventListener('click', function() { exportSelectedToPlan(); });
        document.getElementById('he-ib-sel-clear').addEventListener('click', function() { ibSelectedIds.clear(); updateIbSelBar(); renderIBTable(); });

        // Search input
        var searchEl = document.getElementById('he-ib-search');
        if (searchEl) searchEl.addEventListener('input', function() {
            ibFilterText = searchEl.value.trim();
            renderIBTabs();
            renderIBTable();
        });
        var searchClear = document.getElementById('he-ib-search-clear');
        if (searchClear) searchClear.addEventListener('click', function() {
            ibFilterText = '';
            if (searchEl) searchEl.value = '';
            renderIBTabs();
            renderIBTable();
        });
        // Trailer filter buttons (All / Sortable / XD) — exclusive
        document.querySelectorAll('.he-ib-tfilter').forEach(function(btn) {
            btn.addEventListener('click', function() {
                ibTrailerFilter = btn.getAttribute('data-tf');
                ibFilterXD = (ibTrailerFilter === 'xd');
                ibFilterSortable = (ibTrailerFilter === 'sortable');
                GM_setValue('he-ib-trailer-filter', ibTrailerFilter);
                updateTfilterButtons();
                renderIBTabs();
                renderIBTable();
            });
        });
        updateTfilterButtons();

        renderIBTabs();
        if (typeof renderIBTable === 'function') renderIBTable();
    }

    function updateTfilterButtons() {
        var isDark = GM_getValue('he-theme', 'light') === 'dark';
        var activeBg = isDark ? '#3d1020' : '#ffdbe2';
        var activeFg = isDark ? '#ff4070' : '#cc1040';
        document.querySelectorAll('.he-ib-tfilter').forEach(function(btn) {
            var active = btn.getAttribute('data-tf') === ibTrailerFilter;
            btn.style.background = active ? activeBg : 'var(--he-bg)';
            btn.style.color = active ? activeFg : 'var(--he-muted)';
            btn.style.border = '1px solid ' + (active ? '#cc1040' : 'var(--he-border)');
        });
    }

    function updateIbSelBar() {
        reconcileIbSelection();
        var bar = document.getElementById('he-ib-selbar');
        var info = document.getElementById('he-ib-sel-info');
        if (!bar) return;
        if (ibSelectedIds.size === 0) { bar.style.display = 'none'; return; }
        bar.style.display = 'flex';
        var sel = (ibTableData || []).filter(function(r) { return ibSelectedIds.has(r.vrid); });
        // Sum each visible numeric column across selected rows (identical to Hydra)
        var visibleCols = ibColOrder.filter(function(k) { return ibVisibleCols.has(k); })
            .map(function(k) { return IB_COLS.find(function(c) { return c.key === k; }); }).filter(Boolean);
        var parts = [];
        visibleCols.forEach(function(c) {
            if (c.type !== 'num' || c.key === 'progress') return;
            var sum = sel.reduce(function(s, r) { return s + (Number(r[c.key]) || 0); }, 0);
            parts.push(c.label + ': <strong style="color:#ff9900">' + sum.toLocaleString() + '</strong>');
        });
        if (info) info.innerHTML = '<strong style="color:#ff9900">' + ibSelectedIds.size + '</strong> trailer' + (ibSelectedIds.size !== 1 ? 's' : '') +
            ' selected &nbsp;|&nbsp; ' + parts.join(' &nbsp; ');
    }

    // Sum selected trailers' package sizes and write into the Plan Volume Mix.
    function exportSelectedToPlan() {
        if (ibSelectedIds.size === 0) return;
        var sums = { extraSmall:0, small:0, medium:0, large:0, extraLarge:0, nonCon:0, nonConPlus:0 };
        var fluidSum = 0, ctzdSum = 0;
        (ibTableData || []).forEach(function(r) {
            if (!ibSelectedIds.has(r.vrid)) return;
            sums.extraSmall += r.extraSmall || 0;
            sums.small      += r.small || 0;
            sums.medium     += r.medium || 0;
            sums.large      += r.large || 0;
            sums.extraLarge += r.extraLarge || 0;
            sums.nonCon     += r.ncOnly || 0;
            sums.nonConPlus += r.ncPlus || 0;
            fluidSum += r.fluid || 0;
            ctzdSum  += r.containerized || 0;
        });
        var total = sums.extraSmall + sums.small + sums.medium + sums.large + sums.extraLarge + sums.nonCon + sums.nonConPlus;
        if (!engineSettings.planVars) engineSettings.planVars = {};
        // Store exact package counts per size = the "data pull" (trailers the
        // user plans to unload). Used by Scaling (for mix %) and Exact (counts).
        engineSettings.planVars.volumeMixPackages = sums;
        engineSettings.planVars.sortVolumeGoal = String(total);
        // Fluid vs containerized split from the selected trailers
        engineSettings.planVars.fluidVolume = String(fluidSum);
        engineSettings.planVars.containerizedVolume = String(ctzdSum);
        saveSettings();
        // Switch to Engine → Plan so the result is visible
        var engTab = document.querySelector('.he-view-tab.eng-tab');
        if (engTab) engTab.click();
        var planTabBtn = document.querySelector('.he-tab[data-tab="plan"]');
        if (planTabBtn) planTabBtn.click();
        if (typeof renderPlanVarsPanel === 'function') renderPlanVarsPanel();
        if (typeof renderPlanTable === 'function') renderPlanTable();
        setStatus('\u2714 Exported ' + total.toLocaleString() + ' pkgs from ' + ibSelectedIds.size + ' trailers to Plan');
    }

    function doIbRefresh() {
        var btn = document.getElementById('he-ib-refresh-btn');
        if (btn) { btn.disabled = true; btn.textContent = 'Loading\u2026'; }
        setStatus('Authenticating\u2026');
        fetchToken().then(function() {
            return fetchAndBuildIB(function() {
                if (typeof renderIBTable === 'function') renderIBTable();
                renderIBTabs();
            }, false);
        }).then(function(data) {
            ibTableData = data || [];
            reconcileIbSelection();
            renderIBTabs();
            if (typeof renderIBTable === 'function') renderIBTable();
            setStatus('\u2714 ' + ibTableData.length + ' inbound loads \u2014 ' + new Date().toLocaleTimeString());
        }).catch(function(e) {
            console.error('[Hydra Engine] IB refresh failed:', e);
            setStatus('\u2717 ' + (e && e.message ? e.message : e));
        }).then(function() {
            if (btn) { btn.disabled = false; btn.textContent = 'Refresh'; }
        });
    }

    function renderIBTabs() {
        var wrap = document.getElementById('he-ib-tabs');
        if (!wrap) return;
        var isDark = GM_getValue('he-theme', 'light') === 'dark';
        var actCountBg = isDark ? '#3d1020' : '#ffdbe2';
        var actFg = isDark ? '#ff4070' : '#cc1040';
        wrap.innerHTML = IB_TABS.map(function(t) {
            var rows = (t.isChart) ? [] : getIBFiltered(t.id);
            var active = ibActiveTab === t.id;
            var countHtml = t.isChart ? '' : '<span style="margin-left:5px;background:' + (active ? actCountBg : 'var(--he-border2)') + ';color:' + (active ? actFg : 'var(--he-muted)') + ';border:1px solid ' + (active ? actFg : 'transparent') + ';border-radius:8px;padding:0 6px;font-size:10px;font-weight:700">' + rows.length + '</span>';
            return '<div class="he-ib-tab" data-tab="' + t.id + '" style="padding:7px 14px;font-size:12px;font-weight:700;cursor:pointer;color:' + (active ? actFg : 'var(--he-muted)') + ';border-bottom:3px solid ' + (active ? '#ff2855' : 'transparent') + ';margin-bottom:-2px;user-select:none">' + t.label + countHtml + '</div>';
        }).join('');
        wrap.querySelectorAll('.he-ib-tab').forEach(function(el) {
            el.addEventListener('click', function() {
                ibActiveTab = el.getAttribute('data-tab');
                renderIBTabs();
                if (typeof renderIBTable === 'function') renderIBTable();
            });
        });
    }
    // ═══════════════════════════════════════════════════════════════════════════
    // END INBOUND Stage 2d
    // ═══════════════════════════════════════════════════════════════════════════

    // ═══════════════════════════════════════════════════════════════════════════
    // INBOUND Stage 2e — IB table render. Faithful to Hydra for the in-scope
    // default columns; excluded branches (dock-door/YMS/obRoutes/projFinish)
    // omitted. Styled to match Hydra's dark red-accented IB table.
    // ═══════════════════════════════════════════════════════════════════════════
    var ROUTE_LABELS = {
        'route-blue': 'Small box - fluid',
        'route-green': 'Small box - containerized',
        'route-orange': 'Big box - fluid',
        'route-yellow': 'Big box - containerized',
    };
    var ROUTE_PILL = {
        'route-yellow': { bg: '#f5c518', color: '#000' },
        'route-green':  { bg: '#4caf50', color: '#000' },
        'route-orange': { bg: '#ff9800', color: '#000' },
        'route-blue':   { bg: '#1565c0', color: '#fff' }
    };
    var SVG_53FT_SRC = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 24"><rect x="18" y="3" width="44" height="15" rx="1" fill="white" stroke="#999" stroke-width="1"/><line x1="18" y1="8" x2="62" y2="8" stroke="#ddd" stroke-width="0.5"/><line x1="18" y1="13" x2="62" y2="13" stroke="#ddd" stroke-width="0.5"/><rect x="3" y="7" width="16" height="11" rx="2" fill="#cc2200"/><rect x="7" y="3" width="11" height="6" rx="1" fill="#cc2200"/><rect x="8" y="4" width="7" height="4" rx="0.5" fill="#88ccff" opacity="0.9"/><rect x="16" y="13" width="3" height="2" fill="#666"/><circle cx="26" cy="20" r="3" fill="#333"/><circle cx="26" cy="20" r="1.2" fill="#666"/><circle cx="34" cy="20" r="3" fill="#333"/><circle cx="34" cy="20" r="1.2" fill="#666"/><circle cx="50" cy="20" r="3" fill="#333"/><circle cx="50" cy="20" r="1.2" fill="#666"/><circle cx="58" cy="20" r="3" fill="#333"/><circle cx="58" cy="20" r="1.2" fill="#666"/><circle cx="8" cy="20" r="3" fill="#333"/><circle cx="8" cy="20" r="1.2" fill="#666"/></svg>';
    var SVG_BOX_SRC = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 24"><rect x="10" y="4" width="28" height="14" rx="1" fill="white" stroke="#999" stroke-width="1"/><rect x="2" y="8" width="10" height="10" rx="2" fill="#cc2200"/><rect x="3" y="9" width="5" height="5" rx="0.5" fill="#88ccff" opacity="0.9"/><circle cx="8" cy="20" r="3" fill="#333"/><circle cx="8" cy="20" r="1.2" fill="#666"/><circle cx="28" cy="20" r="3" fill="#333"/><circle cx="28" cy="20" r="1.2" fill="#666"/><circle cx="35" cy="20" r="3" fill="#333"/><circle cx="35" cy="20" r="1.2" fill="#666"/></svg>';
    var SVG_53FT = 'data:image/svg+xml;base64,' + btoa(SVG_53FT_SRC);
    var SVG_BOX = 'data:image/svg+xml;base64,' + btoa(SVG_BOX_SRC);
    var EQUIP_MAP = {
        'FIFTY_THREE_FOOT_TRUCK': { src: SVG_53FT, label: '53ft Trailer', isSvg: true, w: 40, h: 15 },
        'TWENTY_SIX_FOOT_BOX_TRUCK': { src: SVG_BOX, label: '26ft Box', isSvg: true, w: 28, h: 15 },
        'INTERMODAL': { src: '\uD83D\uDEA2', label: 'Intermodal', isSvg: false },
        'INTERMODAL_CONTAINER': { src: '\uD83D\uDEA2', label: 'Intermodal', isSvg: false },
        'SPRINTER': { src: '\uD83D\uDE8C', label: 'Sprinter', isSvg: false },
        'STRAIGHT_TRUCK': { src: '\uD83D\uDE9A', label: 'Straight Truck', isSvg: false }
    };
    function equipCell(t) {
        if (!t) return { html: '?', label: 'Unknown' };
        var k = t.toUpperCase().trim(), i = EQUIP_MAP[k];
        if (!i) return { html: '?', label: t };
        if (i.isSvg) return { html: '<img src="' + i.src + '" style="width:' + i.w + 'px;height:' + i.h + 'px;vertical-align:middle;">', label: i.label };
        return { html: i.src, label: i.label };
    }
    function routeColorClass(r) {
        var isCtn = r.fluid < 50 && r.containerized > 50;
        if (isCtn) return r.noncon > 50 ? 'route-yellow' : 'route-green';
        if (r.total > 0) return r.noncon > 50 ? 'route-orange' : 'route-blue';
        return '';
    }
    function formatEtaCountdown(etaMs) {
        if (!etaMs || typeof etaMs !== 'number') return '\u2014';
        var diffMin = Math.round((etaMs - Date.now()) / 60000);
        var past = diffMin < 0;
        var abs = Math.abs(diffMin);
        var sign = past ? '-' : '';
        var countdown = (abs < 60) ? (sign + abs + 'm') : (sign + Math.floor(abs / 60) + 'h ' + (abs % 60) + 'm');
        var tzOff = getEffectiveTzOffset();
        var arrD = new Date(etaMs + tzOff * 3600000);
        var arrTime = '(' + ('0' + arrD.getUTCHours()).slice(-2) + ':' + ('0' + arrD.getUTCMinutes()).slice(-2) + ')';
        return countdown + ' ' + arrTime;
    }
    function computeSlaThresholdMs() {
        if (!cptSlaEnabled) return null;
        var _slaH = (typeof cptSlaHours === 'number' && cptSlaHours > 0) ? cptSlaHours : 4;
        var _lastEnd = null;
        if (selectedCptIds && selectedCptIds.length) {
            selectedCptIds.forEach(function(id){
                var _d = getCptPresetDates(id);
                var _ems = parseCptMs(_d.end);
                if (_ems !== null && (_lastEnd === null || _ems > _lastEnd)) _lastEnd = _ems;
            });
        }
        if (_lastEnd === null) {
            var _endEl = document.getElementById('he-ib-cpt-end-input');
            if (_endEl && _endEl.value) _lastEnd = parseCptMs(_endEl.value);
        }
        if (_lastEnd === null) return null;
        return _lastEnd - _slaH * 3600000;
    }

    var IB_BADGE_LIGHT = {
        'UNLOADING_IN_PROGRESS': ['#43a860','#fff'], 'READY_FOR_UNLOAD': ['#3183ce','#fff'],
        'UNLOADING_PAUSED': ['#e0952e','#fff'], 'LOAD_ARRIVED': ['#d98a2b','#fff'],
        'IN_TRANSIT': ['#a465c4','#fff'], 'SCHEDULED': ['#6aa84f','#fff'],
        'MANIFESTED': ['#a465c4','#fff'], 'COMPLETED': ['#5f70cf','#fff']
    };
    var IB_BADGE_DARK = {
        'UNLOADING_IN_PROGRESS': ['#1a4731','#2e9e4f'], 'READY_FOR_UNLOAD': ['#1a3a5c','#2f7fc8'],
        'UNLOADING_PAUSED': ['#3d2a00','#c87f0a'], 'LOAD_ARRIVED': ['#3d2a00','#cc7a00'],
        'IN_TRANSIT': ['#2a1a3d','#8e44ad'], 'SCHEDULED': ['#1a2a1a','#2e9e4f'],
        'MANIFESTED': ['#2a1a3d','#8e44ad'], 'COMPLETED': ['#1a1a2a','#3f51b5']
    };
    function ibBadge(ds, status) {
        var isDark = GM_getValue('he-theme', 'light') === 'dark';
        var map = isDark ? IB_BADGE_DARK : IB_BADGE_LIGHT;
        var c = map[ds] || map[status] || (isDark ? ['#2a2a2a','#bbb'] : ['#7a8a9a','#fff']);
        var border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.45)';
        return '<span style="display:inline-block;background:' + c[0] + ';color:' + c[1] + ';padding:2px 8px;border-radius:10px;font-size:11px;font-weight:700;border:1px solid ' + border + ';white-space:nowrap">' + String(ds).replace(/_/g,' ') + '</span>';
    }

    function ibNumFmt(v) { return (v || 0).toLocaleString(); }

    function renderIBTable() {
        var wrap = document.getElementById('he-ib-table-wrap');
        if (!wrap) return;

        if (!Array.isArray(ibTableData) || ibTableData.length === 0) {
            wrap.innerHTML = '<div style="padding:40px;text-align:center;color:var(--he-muted);font-size:13px">Click <strong style="color:#ff4070">Refresh</strong> to load Inbound.</div>';
            return;
        }
        if (ibActiveTab === 'volavail') {
            wrap.innerHTML = '<div style="padding:40px;text-align:center;color:var(--he-muted);font-size:13px">Volume Available chart \u2014 ported in the next sub-stage.</div>';
            return;
        }

        var data = getIBFiltered(ibActiveTab);
        var _sortState = getIbSort();
        var _sortKey = _sortState.key, _sortDir = _sortState.dir;
        data.sort(function(a, b) {
            var av = a[_sortKey], bv = b[_sortKey];
            if (_sortKey === 'sat') { av = a.satMs; bv = b.satMs; }
            if (_sortKey === 'aat') { av = a.aatMs; bv = b.aatMs; }
            if (_sortKey === 'eta') { av = a.etaMs; bv = b.etaMs; }
            if (_sortKey === 'progress') {
                av = a.total > 0 ? (a.total - a.remaining) / a.total : 0;
                bv = b.total > 0 ? (b.total - b.remaining) / b.total : 0;
            }
            if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * _sortDir;
            return String(av || '').localeCompare(String(bv || '')) * _sortDir;
        });

        var visArr = ibColOrder.filter(function(k) { return ibVisibleCols.has(k); });
        var thStyle = 'position:sticky;top:0;z-index:10;background:var(--he-panel);color:#cc1040;padding:7px 12px;text-align:center;border-bottom:2px solid #cc1040;white-space:nowrap;font-weight:700;cursor:pointer';
        var headHtml = '<tr>' + visArr.map(function(k) {
            var c = IB_COLS.find(function(col) { return col.key === k; });
            var arrow = _sortKey === k ? (_sortDir === 1 ? ' \u25B2' : ' \u25BC') : '';
            return '<th data-key="' + k + '" style="' + thStyle + '">' + (c ? c.label : k) + arrow + '</th>';
        }).join('') + '</tr>';

        var totals = { total: 0, sortable: 0, crossdock: 0, cpt: 0, noncon: 0, ncCpt: 0, nextCpt: 0, containers: 0, fluid: 0, containerized: 0 };
        data.forEach(function(r) {
            totals.total += r.total || 0; totals.sortable += r.sortable || 0; totals.crossdock += r.crossdock || 0;
            totals.cpt += r.cpt || 0; totals.noncon += r.noncon || 0; totals.ncCpt += r.ncCpt || 0; totals.nextCpt += r.nextCpt || 0;
            totals.containers += r.containers || 0; totals.fluid += r.fluid || 0; totals.containerized += r.containerized || 0;
        });
        totals.fluidPct = totals.total > 0 ? Math.round((totals.fluid / totals.total) * 100) : 0;
        totals.containerizedPct = totals.total > 0 ? Math.round((totals.containerized / totals.total) * 100) : 0;
        var totCell = 'padding:5px 10px;font-weight:700;background:var(--he-border2);color:var(--he-text);border-bottom:1px solid var(--he-border)';
        var totalsHtml = '<tr>' + visArr.map(function(k) {
            var v = '';
            if (k === 'equip') v = data.length;
            else if (k === 'vrid') v = 'TOTAL';
            else if (k === 'fluidPct') v = totals.fluidPct + '%';
            else if (k === 'containerizedPct') v = totals.containerizedPct + '%';
            else if (totals[k] !== undefined) v = ibNumFmt(totals[k]);
            return '<td style="' + totCell + (typeof v === 'number' || /^\d/.test(String(v)) ? ';text-align:right' : '') + '">' + v + '</td>';
        }).join('') + '</tr>';

        var _slaThresholdMs = computeSlaThresholdMs();
        var tdBase = 'padding:4px 10px;border-bottom:1px solid var(--he-border);color:var(--he-text);white-space:nowrap';
        var rowsHtml = data.map(function(r) {
            var noHeat = (_slaThresholdMs !== null && r.aatMs && r.aatMs > _slaThresholdMs);
            var cells = visArr.map(function(k) {
                if (k === 'equip') { var eq = equipCell(r.equipType); return '<td style="' + tdBase + ';text-align:center" title="' + eq.label + '">' + eq.html + '</td>'; }
                if (k === 'vrid') return '<td style="' + tdBase + '"><span class="he-ib-copy" data-copy="' + r.vrid + '" style="color:#1f6feb;font-weight:600;cursor:pointer" title="Click to copy">' + r.vrid + '</span></td>';
                if (k === 'route') {
                    var rc = routeColorClass(r);
                    var pill = ROUTE_PILL[rc];
                    var routeTxt = r.route || '\u2014';
                    if (!pill) return '<td style="' + tdBase + '">' + routeTxt + '</td>';
                    return '<td style="' + tdBase + '"><span title="' + (ROUTE_LABELS[rc] || '') + '" style="background:' + pill.bg + ';color:' + pill.color + ';border-radius:4px;padding:1px 7px;font-weight:700;border:1px solid rgba(0,0,0,0.45)">' + routeTxt + '</span></td>';
                }
                if (k === 'status') { var ds = r.displayStatus || r.status; return '<td style="' + tdBase + '">' + ibBadge(ds, r.status) + '</td>'; }
                if (k === 'progress') {
                    var pct = (r.total > 0) ? Math.max(0, Math.min(100, Math.round(((r.total - r.remaining) / r.total) * 100))) : 0;
                    var pc = pct < 10 ? '#c0392b' : pct < 25 ? '#d35400' : pct < 50 ? '#e67e22' : pct < 75 ? '#f1c40f' : '#27ae60';
                    return '<td style="' + tdBase + ';min-width:90px"><div style="position:relative;background:var(--he-border2);border:1px solid rgba(255,255,255,0.08);border-radius:3px;height:16px;overflow:hidden"><div style="height:100%;width:' + pct + '%;background:' + pc + '"></div><span style="position:absolute;top:0;left:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,.7)">' + pct + '%</span></div></td>';
                }
                if (k === 'cpt') return cptCellHtml(r.cpt, noHeat);
                if (k === 'ncCpt') return ncCptCellHtml(r.ncCpt, noHeat);
                if (k === 'fluidPct') return '<td style="' + tdBase + ';text-align:right">' + r.fluidPct + '%</td>';
                if (k === 'containerizedPct') return '<td style="' + tdBase + ';text-align:right">' + r.containerizedPct + '%</td>';
                if (k === 'containerized') {
                    var _ppc = ppcColorStyle(r.containerized, r.containers);
                    return '<td style="' + tdBase + ';text-align:right;' + _ppc + '">' + ibNumFmt(r.containerized) + '</td>';
                }
                if (k === 'eta') {
                    if (!r.etaMs) return '<td style="' + tdBase + '">\u2014</td>';
                    var etaColor = r.etaMs < Date.now() ? '#e5484d' : 'var(--he-text)';
                    return '<td style="' + tdBase + ';color:' + etaColor + '">' + formatEtaCountdown(r.etaMs) + '</td>';
                }
                if (k === 'sat' || k === 'aat') return '<td style="' + tdBase + '">' + (r[k] || '\u2014') + '</td>';
                if (k === 'location' || k === 'route' || k === 'vrid') return '<td style="' + tdBase + '">' + (r[k] != null ? r[k] : '\u2014') + '</td>';
                // numeric default
                var val = r[k];
                if (typeof val === 'number') return '<td style="' + tdBase + ';text-align:right">' + (val === 0 ? '<span style="color:var(--he-muted)">0</span>' : ibNumFmt(val)) + '</td>';
                return '<td style="' + tdBase + '">' + (val != null ? val : '\u2014') + '</td>';
            }).join('');
            return '<tr class="he-ib-row' + (ibSelectedIds.has(r.vrid) ? ' selected' : '') + '" data-vrid="' + r.vrid + '" style="cursor:pointer">' + cells + '</tr>';
        }).join('');

        wrap.innerHTML = '<table style="width:max-content;border-collapse:collapse;font-size:12px;background:var(--he-bg);color:var(--he-text)"><thead>' + headHtml + '</thead><tbody>' + totalsHtml + rowsHtml + '</tbody></table>';

        var countEl = document.getElementById('he-ib-search-count');
        if (countEl) countEl.textContent = (ibFilterText || ibFilterXD || ibFilterSortable) ? (data.length + ' shown') : '';

        // Header sort
        wrap.querySelectorAll('th[data-key]').forEach(function(th) {
            th.addEventListener('click', function() {
                var k = th.getAttribute('data-key');
                var s = getIbSort();
                if (s.key === k) s.dir = -s.dir; else { s.key = k; s.dir = -1; }
                renderIBTable();
            });
        });
        // Copy VRID
        wrap.querySelectorAll('.he-ib-copy').forEach(function(el) {
            el.addEventListener('click', function(e) {
                e.stopPropagation();
                var v = el.getAttribute('data-copy');
                try { navigator.clipboard.writeText(v); } catch(_) {}
                var old = el.textContent; el.textContent = 'Copied!';
                setTimeout(function(){ el.textContent = old; }, 900);
            });
        });
        // Row selection — drag-select with auto-scroll, shift-range, click-toggle (identical to Hydra)
        var wrapEl = wrap;
        if (wrapEl && wrapEl._cleanupDrag) { wrapEl._cleanupDrag(); wrapEl._cleanupDrag = null; }
        var dataRows = Array.from(wrapEl.querySelectorAll('tr.he-ib-row'));
        var lastClickIdx = null;
        var dragLastX = 0, dragLastY = 0;

        dataRows.forEach(function(row, idx) {
            row.addEventListener('mousedown', function(e) {
                if (e.target.tagName === 'A' || (e.target.classList && e.target.classList.contains('he-ib-copy')) || e.button !== 0) return;
                e.preventDefault();
                dragAnchor = idx; dragCurrent = idx; isDragging = false;
            });
        });

        var ibStopAutoScroll = function() {
            if (autoScrollTimer) { clearInterval(autoScrollTimer); autoScrollTimer = null; }
        };
        var ibDoAutoScroll = function(direction) {
            if (autoScrollTimer) return;
            autoScrollTimer = setInterval(function() {
                if (dragAnchor === null) { clearInterval(autoScrollTimer); autoScrollTimer = null; return; }
                wrapEl.scrollTop += direction * 18;
                var target = document.elementFromPoint(dragLastX, dragLastY);
                if (!target) return;
                var targetRow = target.closest ? target.closest('tr.he-ib-row') : null;
                var tidx = targetRow ? dataRows.indexOf(targetRow) : -1;
                if (tidx !== -1 && tidx !== dragCurrent) { isDragging = true; dragCurrent = tidx; }
                var lo = Math.min(dragAnchor, dragCurrent), hi = Math.max(dragAnchor, dragCurrent);
                dataRows.forEach(function(r, i) { r.classList.toggle('drag-preview', i >= lo && i <= hi); });
            }, 40);
        };
        var ibOnMouseMove = function(e) {
            if (dragAnchor === null) return;
            dragLastX = e.clientX; dragLastY = e.clientY;
            var wrapRect = wrapEl.getBoundingClientRect();
            var edgeZone = 40;
            if (e.clientY > wrapRect.bottom - edgeZone) { ibDoAutoScroll(1); }
            else if (e.clientY < wrapRect.top + edgeZone) { ibDoAutoScroll(-1); }
            else { ibStopAutoScroll(); }
            var target = document.elementFromPoint(e.clientX, e.clientY);
            if (!target) return;
            var targetRow = target.closest ? target.closest('tr.he-ib-row') : null;
            if (!targetRow) return;
            var tidx = dataRows.indexOf(targetRow);
            if (tidx === -1 || tidx === dragCurrent) return;
            isDragging = true; dragCurrent = tidx;
            var lo = Math.min(dragAnchor, dragCurrent), hi = Math.max(dragAnchor, dragCurrent);
            dataRows.forEach(function(r, i) { r.classList.toggle('drag-preview', i >= lo && i <= hi); });
        };
        var ibOnMouseUp = function(e) {
            ibStopAutoScroll();
            if (dragAnchor === null) return;
            var lo = Math.min(dragAnchor, dragCurrent), hi = Math.max(dragAnchor, dragCurrent);
            if (!isDragging) {
                var row = dataRows[dragAnchor], vrid = row ? row.dataset.vrid : null;
                if (vrid && e.target.tagName !== 'A' && !(e.target.classList && e.target.classList.contains('he-ib-copy'))) {
                    if (e.shiftKey && lastClickIdx !== null) {
                        var slo = Math.min(lastClickIdx, dragAnchor), shi = Math.max(lastClickIdx, dragAnchor);
                        for (var i = slo; i <= shi; i++) { ibSelectedIds.add(dataRows[i].dataset.vrid); dataRows[i].classList.add('selected'); }
                    } else {
                        if (ibSelectedIds.has(vrid)) { ibSelectedIds.delete(vrid); row.classList.remove('selected'); }
                        else { ibSelectedIds.add(vrid); row.classList.add('selected'); }
                        lastClickIdx = dragAnchor;
                    }
                }
            } else {
                if (!e.shiftKey) { ibSelectedIds.clear(); dataRows.forEach(function(r) { r.classList.remove('selected'); }); }
                for (var j = lo; j <= hi; j++) { ibSelectedIds.add(dataRows[j].dataset.vrid); dataRows[j].classList.add('selected'); }
                lastClickIdx = hi;
            }
            dataRows.forEach(function(r) { r.classList.remove('drag-preview'); });
            dragAnchor = null; dragCurrent = null; isDragging = false;
            updateIbSelBar();
        };
        document.addEventListener('mousemove', ibOnMouseMove);
        document.addEventListener('mouseup', ibOnMouseUp);
        wrapEl._cleanupDrag = function() {
            ibStopAutoScroll();
            document.removeEventListener('mousemove', ibOnMouseMove);
            document.removeEventListener('mouseup', ibOnMouseUp);
        };
        updateIbSelBar();
    }
    // ═══════════════════════════════════════════════════════════════════════════
    // END INBOUND Stage 2e
    // ═══════════════════════════════════════════════════════════════════════════

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 2: DATA LAYER (API wrappers — swap for fetch() in webapp)
    // ═══════════════════════════════════════════════════════════════════════════

    function fetchIBData(node) {
        // TODO: pull inbound trailer data from SSP
        // Returns: array of trailer objects {vrid, route, status, total, sortable, containerized, fluid, noncon, eta, location}
        return Promise.resolve([]);
    }

    function fetchWATTData(node) {
        // TODO: pull workstation/associate data from WATT
        // Returns: {associates, scanRates, inductRates, processPathCounts}
        return Promise.resolve({});
    }

    function fetchSTEMData(node) {
        // TODO: pull WIP and flow data from STEM
        // Returns: {wip, scanRate5m, inductRate5m, arFlow5m}
        return Promise.resolve({});
    }

    function fetchYMSData(node) {
        // TODO: pull yard state from YMS
        // Returns: array of door states
        return Promise.resolve([]);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 3: GRAPH ENGINE (deterministic — no DOM, no GM_ calls)
    // ═══════════════════════════════════════════════════════════════════════════

    // Graph data model
    var graph = {
        nodes: {},      // id → node
        edges: [],      // flow connections
        wipPools: {},   // id → WIP pool
        sources: {},    // id → source (trailers)
        output: null    // TPH definition
    };

    function createNode(id, name, ratePer5min, opts) {
        opts = opts || {};
        return {
            id: id,
            name: name,
            ratePer5min: ratePer5min,
            minHC: opts.minHC || 0,
            maxHC: opts.maxHC || 999,
            currentHC: 0,
            constraints: opts.constraints || [],
            volumeAvailable: 0,
            isFlowHC: opts.isFlowHC !== false // defaults to true
        };
    }

    function createEdge(fromId, toId, split, label) {
        return { from: fromId, to: toId, split: split || 1.0, label: label || '' };
    }

    function createWIPPool(id, name, currentLevel) {
        return {
            id: id,
            name: name,
            currentLevel: currentLevel || 0,
            thresholds: { dangerLow: 15, idealLow: 30, idealHigh: 60 }
        };
    }

    function createOutput(id, formula, components) {
        return { id: id, formula: formula, components: components };
    }

    // ─── Graph Builder ───────────────────────────────────────────────────────

    function buildGraph(definition) {
        // Reset
        graph.nodes = {};
        graph.edges = [];
        graph.wipPools = {};
        graph.sources = {};
        graph.output = null;

        // Build nodes
        definition.nodes.forEach(function(n) {
            graph.nodes[n.id] = createNode(n.id, n.name, n.ratePer5min, n);
        });

        // Build edges
        definition.edges.forEach(function(e) {
            graph.edges.push(createEdge(e.from, e.to, e.split, e.label));
        });

        // Build WIP pools
        definition.wipPools.forEach(function(w) {
            graph.wipPools[w.id] = createWIPPool(w.id, w.name, w.currentLevel);
        });

        // Build output
        if (definition.output) {
            graph.output = createOutput(definition.output.id, definition.output.formula, definition.output.components);
        }

        return graph;
    }

    // ─── ORD9 Graph Definition ───────────────────────────────────────────────

    var ORD9_GRAPH = {
        nodes: [
            { id: 'container_unload', name: 'Container Unload', ratePer5min: 600, minHC: 6, maxHC: 6, constraints: ['fixed_crew'] },
            { id: 'fluid_unload', name: 'Fluid Unload (Small Box)', ratePer5min: 67, minHC: 0, maxHC: 20, constraints: ['max_2_per_trailer', 'spread_first'] },
            { id: 'bb_unload', name: 'Big Box Unload', ratePer5min: 25, minHC: 0, maxHC: 20, constraints: ['exactly_2_per_trailer'] },
            { id: 'ar_induct', name: 'AR Induct', ratePer5min: 33, minHC: 3, maxHC: 20 },
            { id: 'robin_induct', name: 'Robin Induct', ratePer5min: 600, minHC: 0, maxHC: 0, isFlowHC: false }, // HC covered by container_unload
            { id: 'scanner', name: 'Scanner', ratePer5min: 10, minHC: 0, maxHC: 999 }
        ],
        edges: [
            { from: 'fluid_unload', to: 'ar_induct', split: 1.0, label: 'sortable fluid' },
            { from: 'bb_unload', to: 'ar_induct', split: 0.75, label: 'BB sortable' },
            { from: 'bb_unload', to: 'nc_output', split: 0.25, label: 'NC flow' },
            { from: 'container_unload', to: 'robin_induct', split: 1.0, label: 'containerized' },
            { from: 'ar_induct', to: 'mezz_wip', split: 1.0, label: 'inducted' },
            { from: 'robin_induct', to: 'mezz_wip', split: 0.5, label: 'robin → WIP' },  // remainder after AR flow
            { from: 'robin_induct', to: 'ar_flow', split: 0.5, label: 'direct-to-container' },
            { from: 'mezz_wip', to: 'scanner', split: 1.0, label: 'WIP → scan' }
        ],
        wipPools: [
            { id: 'mezz_wip', name: 'Mezzanine WIP', currentLevel: 0 }
        ],
        output: {
            id: 'tph',
            formula: '(scanner_output + ar_flow) * 12 / total_hc',
            components: ['scanner', 'ar_flow']
        }
    };

    // ─── Flow Calculator ─────────────────────────────────────────────────────

    function getNodeInputFlow(nodeId) {
        // Sum of all edges feeding this node
        var total = 0;
        graph.edges.forEach(function(e) {
            if (e.to === nodeId) {
                var fromNode = graph.nodes[e.from];
                var fromPool = graph.wipPools[e.from];
                if (fromNode) {
                    var fromOutput = fromNode.currentHC * fromNode.ratePer5min;
                    total += fromOutput * e.split;
                } else if (fromPool) {
                    // WIP pool feeds based on what's available
                    total += Infinity; // WIP can feed as much as scanner can take
                }
            }
        });
        return total;
    }

    function calculateFlows(alloc) {
        // Apply allocation
        Object.keys(alloc).forEach(function(nodeId) {
            if (graph.nodes[nodeId]) {
                graph.nodes[nodeId].currentHC = alloc[nodeId];
            }
        });

        var flows = {};
        Object.keys(graph.nodes).forEach(function(nodeId) {
            var node = graph.nodes[nodeId];
            var capacity = node.currentHC * node.ratePer5min;
            var inputFlow = getNodeInputFlow(nodeId);
            var actualFlow = Math.min(capacity, inputFlow);

            flows[nodeId] = {
                capacity: capacity,
                inputFlow: inputFlow === Infinity ? capacity : inputFlow,
                actualFlow: actualFlow,
                utilization: capacity > 0 ? Math.round(actualFlow / capacity * 100) : 0
            };
        });

        return flows;
    }

    // ─── Constraint Validator ────────────────────────────────────────────────

    function validateConstraints(alloc) {
        var violations = [];
        var totalAllocated = 0;

        Object.keys(alloc).forEach(function(nodeId) {
            var node = graph.nodes[nodeId];
            if (!node) return;
            var hc = alloc[nodeId];
            totalAllocated += hc;

            // Min/max HC
            if (hc < node.minHC) {
                violations.push({ node: nodeId, rule: 'min_hc', msg: node.name + ': ' + hc + ' < min ' + node.minHC });
            }
            if (hc > node.maxHC) {
                violations.push({ node: nodeId, rule: 'max_hc', msg: node.name + ': ' + hc + ' > max ' + node.maxHC });
            }
        });

        // Induct > fluid check
        var flows = calculateFlows(alloc);
        var inductNode = graph.nodes['ar_induct'];
        if (inductNode && flows['ar_induct'] && flows['fluid_unload']) {
            var inductCap = flows['ar_induct'].capacity;
            var fluidFlow = flows['fluid_unload'].actualFlow;
            // Add BB sortable contribution
            if (flows['bb_unload']) {
                fluidFlow += flows['bb_unload'].actualFlow * 0.75;
            }
            if (inductCap < fluidFlow && fluidFlow > 0) {
                violations.push({ node: 'ar_induct', rule: 'induct_gt_fluid', msg: 'Induct capacity (' + inductCap + ') < IB fluid (' + Math.round(fluidFlow) + ') = JAM' });
            }
        }

        return violations;
    }

    // ─── WIP Projector ───────────────────────────────────────────────────────

    function projectWIP(wipId, inputPer5min, outputPer5min, horizonMin) {
        var pool = graph.wipPools[wipId];
        if (!pool) return [];
        var timeline = [];
        var level = pool.currentLevel;
        var segments = Math.ceil(horizonMin / 5);
        for (var i = 0; i <= segments; i++) {
            var minute = i * 5;
            var perScanner = graph.nodes['scanner'] && graph.nodes['scanner'].currentHC > 0
                ? level / (graph.nodes['scanner'].currentHC * graph.nodes['scanner'].ratePer5min) * 5
                : 999;
            var status = perScanner < 15 ? 'danger_low' : perScanner > 60 ? 'danger_high' : 'ideal';
            timeline.push({ minute: minute, level: Math.round(level), minPerScanner: Math.round(perScanner), status: status });
            level += (inputPer5min - outputPer5min);
            if (level < 0) level = 0;
        }
        return timeline;
    }

    // ─── Bottleneck Finder ───────────────────────────────────────────────────

    function findBottleneck(flows) {
        var worst = null;
        var worstUtil = Infinity;
        Object.keys(flows).forEach(function(nodeId) {
            var f = flows[nodeId];
            if (f.capacity > 0 && f.utilization < worstUtil && graph.nodes[nodeId].isFlowHC) {
                worstUtil = f.utilization;
                // Only consider it a bottleneck if input exceeds capacity
                if (f.inputFlow > f.capacity) {
                    worst = { nodeId: nodeId, capacity: f.capacity, demand: f.inputFlow, gap: f.inputFlow - f.capacity };
                }
            }
        });
        return worst;
    }

    // ─── Optimizer ───────────────────────────────────────────────────────────

    function optimize(flowHC, userInputs) {
        var inputs = userInputs || {};
        var totalHC = inputs.totalHC || 0;
        var ncTarget5m = (inputs.ncTarget || 0) / 12;
        var bbRate5m = (inputs.bbUnload || 300) / 12;
        var wipLevel = inputs.currentWIP || 0;
        var arFlow = inputs.arFlow || 0;
        var scanRate5m = (inputs.scanRate || 140) / 12;
        var inductRate5m = (inputs.inductRate || 400) / 12;
        var sbRate5m = (inputs.smUnload || 800) / 12;
        var robinToWIP = 600 - arFlow; // robin contribution to WIP (robin - AR direct)

        // Step A: Lock mandatory
        var containerHC = 6;
        var bbPerTrailer = bbRate5m / 4;
        var bbTrailersNeeded = ncTarget5m > 0 ? Math.ceil(ncTarget5m / bbPerTrailer) : 0;
        var bbHC = bbTrailersNeeded * 2;
        var remaining = flowHC - containerHC - bbHC;

        // Step B: Start all remaining as scanners
        var scanners = remaining;
        var inductors = 3;
        var sbUnloaders = 0;

        // Step C: Determine if WIP can sustain those scanners for the hour
        var scannerOutput = scanners * scanRate5m;
        var minInductOutput = inductors * inductRate5m;
        var wipInput = minInductOutput + robinToWIP;
        var wipDrainPerMin = (scannerOutput - wipInput) / 5;
        var drainTimeMin = wipDrainPerMin > 0 ? wipLevel / wipDrainPerMin : Infinity;

        // Step D: If WIP drains within the hour, add induction to sustain
        if (drainTimeMin < 60 && drainTimeMin > 0) {
            // Need more WIP input — size induction to sustain scanners
            var neededFromInduct = scannerOutput - robinToWIP;
            if (neededFromInduct > 0) {
                inductors = Math.max(3, Math.min(20, Math.ceil(neededFromInduct / inductRate5m)));
                // Size SB to feed those inductors
                var inductCapacity = inductors * inductRate5m;
                var bbSortable = bbTrailersNeeded * bbRate5m * 0.75;
                var fluidNeeded = inductCapacity - bbSortable;
                if (fluidNeeded > 0) {
                    sbUnloaders = Math.ceil(fluidNeeded / sbRate5m);
                }
            }
            scanners = remaining - inductors - sbUnloaders;
        }

        // Clamp
        inductors = Math.max(3, Math.min(20, inductors));
        scanners = Math.max(0, scanners);
        sbUnloaders = Math.max(0, sbUnloaders);

        // Build allocation
        var allocation = {
            container_unload: containerHC,
            fluid_unload: sbUnloaders,
            bb_unload: bbHC,
            ar_induct: inductors,
            scanner: scanners
        };

        // Calculate flows
        var flows = calculateFlows(allocation);

        // Validate and fix violations (iterate)
        var violations = validateConstraints(allocation);
        var iterations = 0;
        while (violations.length > 0 && iterations < 5) {
            violations.forEach(function(v) {
                if (v.rule === 'induct_gt_fluid' && scanners > 0) {
                    scanners--;
                    inductors++;
                    allocation.ar_induct = inductors;
                    allocation.scanner = scanners;
                }
            });
            flows = calculateFlows(allocation);
            violations = validateConstraints(allocation);
            iterations++;
        }

        // Calculate TPH
        var scannerFlow = scanners * scanRate5m;
        var totalFlow = scannerFlow + arFlow;
        var tphTransient = totalHC > 0 ? Math.round((totalFlow * 12) / totalHC * 10) / 10 : 0;

        // Steady state
        var steadyWipInput = (inductors * inductRate5m) + robinToWIP;
        var steadyScannerFlow = Math.min(scanners * scanRate5m, steadyWipInput);
        var steadyTotalFlow = steadyScannerFlow + arFlow;
        var tphSteady = totalHC > 0 ? Math.round((steadyTotalFlow * 12) / totalHC * 10) / 10 : 0;

        // WIP projection
        graph.wipPools['mezz_wip'].currentLevel = wipLevel;
        var wipTimeline = projectWIP('mezz_wip', steadyWipInput, scanners * scanRate5m, 60);

        return {
            allocation: allocation,
            flows: flows,
            violations: violations,
            tph: { transient: tphTransient, steadyState: tphSteady },
            wipTimeline: wipTimeline,
            meta: {
                flowHC: flowHC,
                totalHC: totalHC,
                bbTrailersStaffed: bbTrailersNeeded,
                ncFlow5m: bbTrailersNeeded * bbPerTrailer,
                wipDelta: Math.round(steadyWipInput - (scanners * scanRate5m))
            }
        };
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 4: DATA MAPPER (API responses → graph nodes)
    // ═══════════════════════════════════════════════════════════════════════════

    function mapIBDataToGraph(ibData, graph) {
        // TODO: map trailer data to source nodes
        // Classify: container, small box, big box
        // Set volumeAvailable on relevant nodes
    }

    function mapWATTDataToGraph(wattData, graph) {
        // TODO: map current HC assignments to graph nodes
        // Set currentHC, actual rates
    }

    function mapSTEMDataToGraph(stemData, graph) {
        // TODO: map WIP levels and flow rates to graph
        // Set wipPool.currentLevel, actual rates
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 5: AI CLIENT (judgment + explanation layer)
    // ═══════════════════════════════════════════════════════════════════════════

    function aiRequest(engineResult, userQuestion, callback) {
        // TODO: send engine result + question to AI server
        // AI receives pre-calculated math, adds judgment/explanation
        // callback(response)
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 6: UI (disposable — gets rebuilt for webapp)
    // ═══════════════════════════════════════════════════════════════════════════

    function createPanel() {

    function applyTheme() {
        var theme = GM_getValue('he-theme', 'light');
        document.documentElement.classList.remove('he-theme-light', 'he-theme-dark');
        document.documentElement.classList.add(theme === 'dark' ? 'he-theme-dark' : 'he-theme-light');
        var btn = document.getElementById('he-theme-toggle');
        if (btn) {
            btn.textContent = (theme === 'dark') ? '☾' : '☀';
            btn.title = (theme === 'dark') ? 'Switch to light mode' : 'Switch to dark mode';
        }
    }

    function toggleTheme() {
        var theme = GM_getValue('he-theme', 'light');
        GM_setValue('he-theme', theme === 'dark' ? 'light' : 'dark');
        applyTheme();
        // Re-render inbound view so theme-dependent colors (badges, active tab/
        // filter pills) update immediately.
        if (ibViewBuilt) {
            if (typeof updateTfilterButtons === 'function') updateTfilterButtons();
            if (typeof renderIBTabs === 'function') renderIBTabs();
            if (typeof renderIBTable === 'function') renderIBTable();
        }
    }

    function savePanelGeometry() {
        var panel = document.getElementById('hydra-engine-panel');
        if (!panel) return;
        var geo = { left: panel.style.left, top: panel.style.top, width: panel.style.width, height: panel.style.height, transform: panel.style.transform };
        GM_setValue('he-panel-geo', geo);
    }

    // Keep the panel (and its draggable header) within the viewport so the
    // logo/header can always be grabbed. Clamps top to >= 0 and leaves at
    // least ~80px of the panel visible horizontally.
    function clampPanel(panel) {
        if (!panel) return;
        var vw = window.innerWidth, vh = window.innerHeight, margin = 80;
        var w = parseFloat(panel.style.width) || panel.offsetWidth || 700;
        var left = parseFloat(panel.style.left);
        var top = parseFloat(panel.style.top);
        if (!isNaN(left)) panel.style.left = Math.min(Math.max(left, margin - w), vw - margin) + 'px';
        if (!isNaN(top)) panel.style.top = Math.min(Math.max(top, 0), vh - 40) + 'px';
    }

    function restorePanelGeometry() {
        var panel = document.getElementById('hydra-engine-panel');
        if (!panel) return;
        var geo = GM_getValue('he-panel-geo', null);
        if (geo) {
            if (geo.left) { panel.style.left = geo.left; panel.style.top = geo.top; panel.style.transform = 'none'; }
            if (geo.width) panel.style.width = geo.width;
            if (geo.height) panel.style.height = geo.height;
        }
        clampPanel(panel);
    }

        // Inject CSS for FAB and panel
        var style = document.createElement('style');
        style.textContent =
            // Theme variables — light (default) and dark
            'html.he-theme-light{--he-bg:#ffffff;--he-panel:#f6f8fa;--he-text:#1a1a1a;--he-muted:#57606a;--he-border:#d0d7de;--he-border2:#e5e8ec}' +
            'html.he-theme-dark{--he-bg:#0d1117;--he-panel:#161b22;--he-text:#e6edf3;--he-muted:#8b949e;--he-border:#30363d;--he-border2:#21262d}' +
            // Fallback if no theme class is present yet (treat as light)
            'html:not(.he-theme-light):not(.he-theme-dark){--he-bg:#ffffff;--he-panel:#f6f8fa;--he-text:#1a1a1a;--he-muted:#57606a;--he-border:#d0d7de;--he-border2:#e5e8ec}' +
            '#he-fab{position:fixed;top:6px;right:18px;z-index:99999;background:linear-gradient(#0d1117,#0d1117) padding-box,linear-gradient(135deg,#ff3030 0%,#ff2060 25%,#a020b8 50%,#2060d8 75%,#20c8f0 100%) border-box;border:2px solid transparent;border-radius:8px;padding:0;cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,.5),0 0 12px rgba(255,48,48,0.4),0 0 12px rgba(32,200,240,0.35);display:inline-flex;align-items:center;justify-content:center;transition:all .2s;line-height:0}' +
            '#he-fab:hover{transform:scale(1.06);box-shadow:0 4px 18px rgba(0,0,0,.6),0 0 18px rgba(255,48,48,0.6),0 0 18px rgba(32,200,240,0.55);filter:brightness(1.08)}' +
            '#hydra-engine-panel{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:1200px;max-width:96vw;height:80vh;min-width:400px;min-height:300px;z-index:99990;background:var(--he-bg);display:none;flex-direction:column;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:var(--he-text);box-shadow:0 8px 40px rgba(0,0,0,.8),0 0 0 1px rgba(48,54,61,.8);border-radius:10px;overflow:visible}' +
            '#hydra-engine-panel.open{display:flex}' +
            // View switcher (Hydra-style Inbound | Engine) — crimson→purple→navy gradient
            '#he-view-switcher{display:flex;position:relative;flex-shrink:0;border-radius:10px 10px 0 0;overflow:visible;background:linear-gradient(90deg,#d01818 0%,#c01830 10%,#a81845 20%,#8e1a60 30%,#7a1880 38%,#8020a0 44%,#9020b0 48%,#a020b8 50%,#9028c0 52%,#8030c8 56%,#6040d0 62%,#4050d8 70%,#2868d8 80%,#1890e0 90%,#10b8ee 100%)}' +
            '.he-view-tab{flex:1;padding:9px 27px;font-size:15px;font-weight:700;text-align:center;cursor:pointer;border-bottom:3px solid transparent;margin-bottom:-2px;transition:all .2s;user-select:none;color:#fff;background:transparent;display:flex;align-items:center;gap:11px;text-shadow:0 1px 3px rgba(0,0,0,0.7);letter-spacing:0.5px}' +
            '.he-view-tab.ib-tab{justify-content:flex-start;padding-left:84px}' +
            '.he-view-tab.eng-tab{justify-content:flex-end;padding-right:84px}' +
            '.he-view-tab:hover{filter:brightness(1.15)}' +
            '.he-view-tab.ib-tab:hover{background:rgba(180,20,30,0.22)}' +
            '.he-view-tab.eng-tab:hover{background:rgba(32,212,240,0.15)}' +
            '.he-view-tab.ib-tab.active{border-bottom-color:#ff2855;background:rgba(255,40,85,0.25)}' +
            '.he-view-tab.eng-tab.active{border-bottom-color:#20d4f0;background:rgba(32,212,240,0.20)}' +
            '#he-logo-center{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:linear-gradient(#0d1117,#0d1117) padding-box,linear-gradient(135deg,#ff3030 0%,#ff2060 25%,#a020b8 50%,#2060d8 75%,#20c8f0 100%) border-box;border:3px solid transparent;border-radius:8px;padding:0;display:inline-flex;align-items:center;justify-content:center;box-shadow:0 2px 10px rgba(0,0,0,.5),0 0 12px rgba(255,48,48,0.4),0 0 12px rgba(32,200,240,0.35);line-height:0;z-index:2;cursor:grab}' +
            '#he-logo-center img{height:43px;width:auto;display:block;filter:drop-shadow(0 0 8px rgba(255,255,255,0.5));border-radius:5px}' +
            '#hydra-engine-panel.ib-view{box-shadow:0 8px 40px rgba(0,0,0,.8),0 0 0 1px #cc1040}' +
            '#hydra-engine-panel.eng-view{box-shadow:0 8px 40px rgba(0,0,0,.8),0 0 0 1px #0a6e8a}' +
            '#he-ib-table-wrap tr.he-ib-row.selected>td{background:rgba(255,40,85,0.18) !important}' +
            '#he-ib-table-wrap tr.he-ib-row.drag-preview>td{background:rgba(255,40,85,0.30) !important}' +
            '#he-ib-table-wrap tr.he-ib-row:hover>td{background:rgba(127,127,127,0.15)}';
        document.head.appendChild(style);
        applyTheme();

        // FAB button (top-right, same style as Hydra)
        var fab = document.createElement('div');
        fab.id = 'he-fab';
        fab.innerHTML = '<img src="' + HYDRA_TEXT_LOGO + '" alt="Hydra" style="height:28px;width:auto;display:block;padding:1px 2px;filter:drop-shadow(0 0 8px rgba(255,255,255,0.5));">';
        document.body.appendChild(fab);

        // Dragon logo in panel header (not floating)

        // Slide-out panel
        var panel = document.createElement('div');
        panel.id = 'hydra-engine-panel';
        panel.innerHTML =
            // View switcher — Inbound (red) | Engine (blue), draggable centered dragon logo
            '<div id="he-view-switcher">' +
                '<div class="he-view-tab ib-tab" data-eview="IB"><span>Inbound</span></div>' +
                '<div id="he-logo-center" title="Hydra Engine"><img src="' + GOLD_DRAGON_ICON + '" alt="Hydra"></div>' +
                '<div class="he-view-tab eng-tab active" data-eview="ENG"><span>Engine</span></div>' +
                '<button id="he-theme-toggle" style="position:absolute;right:50px;top:50%;transform:translateY(-50%);background:rgba(0,0,0,0.35);border:none;color:#fff;font-size:15px;cursor:pointer;padding:3px 7px;border-radius:6px;opacity:1;z-index:3;line-height:1;text-shadow:0 1px 2px rgba(0,0,0,0.8)" title="Toggle light/dark">☀</button>' +
                '<button id="he-close" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:rgba(0,0,0,0.35);border:none;color:#fff;font-size:18px;font-weight:700;cursor:pointer;padding:3px 8px;border-radius:6px;opacity:1;z-index:3;line-height:1;text-shadow:0 1px 2px rgba(0,0,0,0.8)" title="Close">✕</button>' +
            '</div>' +
            // Inbound view (1:1 Hydra inbound — ported in stage 2)
            '<div id="he-ib-view" style="flex:1;overflow:hidden;display:none;flex-direction:column">' +
                '<div style="color:var(--he-muted);text-align:center;padding:40px;font-size:13px">Inbound view — porting from Hydra…</div>' +
            '</div>' +
            // Engine view (existing Build/Plan/Execute/Report)
            '<div id="he-eng-view" style="flex:1;overflow:hidden;display:flex;flex-direction:column">' +
            // Tab bar
            '<div style="display:flex;background:var(--he-panel);border-bottom:1px solid var(--he-border)">' +
                '<button class="he-tab active" data-tab="build" style="flex:1;padding:10px 0;background:none;border:none;border-bottom:2px solid #a020b8;color:var(--he-text);font-size:13px;font-weight:600;cursor:pointer">Build</button>' +
                '<button class="he-tab" data-tab="plan" style="flex:1;padding:10px 0;background:none;border:none;border-bottom:2px solid transparent;color:var(--he-muted);font-size:13px;font-weight:600;cursor:pointer">Plan</button>' +
                '<button class="he-tab" data-tab="execute" style="flex:1;padding:10px 0;background:none;border:none;border-bottom:2px solid transparent;color:var(--he-muted);font-size:13px;font-weight:600;cursor:pointer">Execute</button>' +
                '<button class="he-tab" data-tab="report" style="flex:1;padding:10px 0;background:none;border:none;border-bottom:2px solid transparent;color:var(--he-muted);font-size:13px;font-weight:600;cursor:pointer">Report</button>' +
            '</div>' +
            // Tab content
            '<div id="he-tab-build" class="he-tab-content" style="flex:1;overflow:hidden;display:flex">' +
                // Left panel - Settings list
                '<div style="width:200px;min-width:200px;border-right:1px solid var(--he-border);overflow-y:auto;padding:12px 0">' +
                    '<div style="padding:4px 16px;font-size:10px;text-transform:uppercase;color:var(--he-muted);letter-spacing:1px;margin-bottom:4px">Settings</div>' +
                    '<div class="he-setting-item" data-setting="site-code" style="padding:8px 16px;font-size:12px;color:var(--he-text);cursor:pointer;border-left:3px solid transparent;display:flex;justify-content:space-between;align-items:center">Site Code <span id="he-site-display" style="font-size:10px;color:var(--he-muted);font-weight:600">' + (engineSettings.siteCode || '—') + '</span></div>' +
                    '<div class="he-setting-item" data-setting="presets" style="padding:8px 16px;font-size:12px;color:var(--he-text);cursor:pointer;border-left:3px solid transparent">Presets</div>' +
                    '<div class="he-setting-item" data-setting="sort-times" style="padding:8px 16px;font-size:12px;color:var(--he-text);cursor:pointer;border-left:3px solid transparent">Sort Times</div>' +
                    '<div class="he-setting-item" data-setting="plan-mode" style="padding:8px 16px;font-size:12px;color:var(--he-text);cursor:pointer;border-left:3px solid transparent">Plan Mode</div>' +
                    '<div class="he-setting-item" data-setting="mhe-type-list" style="padding:8px 16px;font-size:12px;color:var(--he-text);cursor:pointer;border-left:3px solid transparent">MHE Type List</div>' +
                    '<div class="he-setting-item" data-setting="mhe-type-attrs" style="padding:8px 16px;font-size:12px;color:var(--he-text);cursor:pointer;border-left:3px solid transparent">MHE Type Attributes</div>' +
                    '<div class="he-setting-item" data-setting="volume-mix" style="padding:8px 16px;font-size:12px;color:var(--he-text);cursor:pointer;border-left:3px solid transparent">Volume Mix</div>' +
                    '<div class="he-setting-item" data-setting="engineer-rates" style="padding:8px 16px;font-size:12px;color:var(--he-text);cursor:pointer;border-left:3px solid transparent">Engineer Rates</div>' +
                    '<div class="he-setting-item" data-setting="learned-rules" style="padding:8px 16px;font-size:12px;color:var(--he-text);cursor:pointer;border-left:3px solid transparent">Learned Rules</div>' +
                '</div>' +
                // Right panel - Groups / Roles
                '<div style="flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column">' +
                    '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">' +
                        '<span style="font-size:12px;font-weight:600;color:var(--he-text)">Groups / Roles</span>' +
                        '<div style="display:flex;gap:6px">' +
                            '<button id="he-check-graph" style="padding:4px 10px;background:#0d9488;color:#fff;border:none;border-radius:4px;font-size:11px;cursor:pointer">Check Graph</button>' +
                            '<button id="he-add-group" style="padding:4px 10px;background:#1f6feb;color:#fff;border:none;border-radius:4px;font-size:11px;cursor:pointer">+ Add Group</button>' +
                        '</div>' +
                    '</div>' +
                    '<div id="he-groups-list" style="flex:1;overflow-y:auto"></div>' +
                '</div>' +
            '</div>' +
            '<div id="he-tab-plan" class="he-tab-content" style="flex:1;overflow:hidden;display:none">' +
                // Left panel - Sort Details & KPIs
                '<div style="width:340px;min-width:340px;border-right:1px solid var(--he-border);overflow-y:auto;padding:12px">' +
                    '<div id="he-plan-vars-panel"></div>' +
                '</div>' +
                // Right panel - Bottoms Up Planner table
                '<div style="flex:1;overflow-y:auto;padding:16px">' +
                    '<div id="he-plan-table"></div>' +
                '</div>' +
            '</div>' +
            '<div id="he-tab-execute" class="he-tab-content" style="flex:1;overflow:hidden;display:none">' +
                '<div style="flex:1;overflow-y:auto;padding:16px">' +
                    '<div id="he-exec-header"></div>' +
                    '<div id="he-exec-table"></div>' +
                '</div>' +
                '<div style="width:340px;border-left:1px solid var(--he-border);display:flex;flex-direction:column;background:var(--he-panel)">' +
                    '<div style="padding:10px 14px;border-bottom:1px solid var(--he-border);font-weight:700;color:var(--he-text);font-size:13px;display:flex;align-items:center;justify-content:space-between"><span>Hydra AI Optimizer</span><button id="he-exec-optimize" style="background:#1f6feb;border:none;border-radius:6px;color:#fff;font-size:11px;font-weight:700;padding:4px 12px;cursor:pointer">Optimize</button></div>' +
                    '<div id="he-exec-ai-messages" style="flex:1;overflow-y:auto;padding:10px;font-size:12px;color:var(--he-text)"></div>' +
                    '<div style="padding:8px;border-top:1px solid var(--he-border);display:flex;gap:6px"><input id="he-exec-ai-input" type="text" placeholder="e.g. protect 14:30, cap TDR at 2" style="flex:1;padding:6px 8px;background:var(--he-bg);border:1px solid var(--he-border);border-radius:6px;color:var(--he-text);font-size:12px"><button id="he-exec-ai-send" style="background:var(--he-border);border:1px solid var(--he-border2);border-radius:6px;color:var(--he-text);font-size:12px;padding:6px 12px;cursor:pointer">Send</button></div>' +
                '</div>' +
            '</div>' +
            '<div id="he-tab-report" class="he-tab-content" style="flex:1;overflow-y:auto;padding:20px;display:none">' +
                '<div style="color:#555;text-align:center;width:100%;padding:40px">Report tab content</div>' +
            '</div>' +
            '</div>'; // close #he-eng-view
        document.body.appendChild(panel);
        restorePanelGeometry();

        // FAB click toggles panel
        fab.addEventListener('click', function() {
            panel.classList.toggle('open');
        });

        // Close button
        document.getElementById('he-close').addEventListener('click', function() {
            panel.classList.remove('open');
        });
        var themeToggleBtn = document.getElementById('he-theme-toggle');
        if (themeToggleBtn) themeToggleBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleTheme();
        });
        applyTheme();

        // View switcher: Inbound (red) | Engine (blue)
        panel.classList.add('eng-view'); // default to Engine view
        function switchEngineView(view) {
            var ib = document.getElementById('he-ib-view');
            var eng = document.getElementById('he-eng-view');
            if (view === 'IB') {
                panel.classList.remove('eng-view'); panel.classList.add('ib-view');
                if (ib) ib.style.display = 'flex';
                if (eng) eng.style.display = 'none';
            } else {
                panel.classList.remove('ib-view'); panel.classList.add('eng-view');
                if (ib) ib.style.display = 'none';
                if (eng) eng.style.display = 'flex';
            }
            document.querySelectorAll('.he-view-tab').forEach(function(t) {
                t.classList.toggle('active', t.getAttribute('data-eview') === view);
            });
            GM_setValue('he-active-view', view);
            if (view === 'IB' && typeof renderInboundView === 'function') renderInboundView();
        }
        document.querySelectorAll('.he-view-tab').forEach(function(tab) {
            tab.addEventListener('click', function() { switchEngineView(tab.getAttribute('data-eview')); });
        });
        // Restore last active view (default Engine)
        switchEngineView(GM_getValue('he-active-view', 'ENG'));

        // Ctrl/Cmd+A: select all inbound rows (identical to Hydra)
        document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'a' && panel.classList.contains('open') && panel.classList.contains('ib-view')) {
                var _ae = e.target || document.activeElement;
                if (_ae && (_ae.tagName === 'INPUT' || _ae.tagName === 'TEXTAREA' || _ae.tagName === 'SELECT' || _ae.isContentEditable)) return;
                e.preventDefault();
                var rows = Array.from(document.querySelectorAll('#he-ib-table-wrap tr.he-ib-row'));
                if (!rows.length) return;
                ibSelectedIds.clear();
                rows.forEach(function(row) { ibSelectedIds.add(row.dataset.vrid); row.classList.add('selected'); });
                updateIbSelBar();
            }
        });

        // Draggable header (via the view switcher / logo; tabs and buttons still clickable)
        (function() {
            var header = document.getElementById('he-view-switcher');
            var isDragging = false, startX, startY, startLeft, startTop;
            header.addEventListener('mousedown', function(e) {
                if (e.target.closest('.he-view-tab') || e.target.id === 'he-close' || e.target.id === 'he-theme-toggle') return;
                isDragging = true;
                var rect = panel.getBoundingClientRect();
                startX = e.clientX; startY = e.clientY;
                startLeft = rect.left; startTop = rect.top;
                panel.style.transform = 'none';
                panel.style.left = rect.left + 'px';
                panel.style.top = rect.top + 'px';
                e.preventDefault();
            });
            document.addEventListener('mousemove', function(e) {
                if (!isDragging) return;
                panel.style.left = (startLeft + e.clientX - startX) + 'px';
                panel.style.top = (startTop + e.clientY - startY) + 'px';
                clampPanel(panel);
            });
            document.addEventListener('mouseup', function() {
                if (isDragging) { isDragging = false; savePanelGeometry(); }
            });
            // Double-click the logo to reset panel to default size/position
            var logo = document.getElementById('he-logo-center');
            if (logo) logo.addEventListener('dblclick', function(e) {
                e.preventDefault(); e.stopPropagation();
                panel.style.left = '50%';
                panel.style.top = '50%';
                panel.style.transform = 'translate(-50%,-50%)';
                panel.style.width = '1200px';
                panel.style.height = '80vh';
                GM_setValue('he-panel-geo', null);
            });
        })();

        // Resizable via bottom-right handle
        (function() {
            var handle = document.createElement('div');
            handle.style.cssText = 'position:absolute;bottom:0;right:0;width:16px;height:16px;cursor:nwse-resize;z-index:2';
            handle.innerHTML = '<svg width="16" height="16" style="opacity:0.4"><path d="M14 16L16 14M10 16L16 10M6 16L16 6" stroke="var(--he-muted)" stroke-width="1.5"/></svg>';
            panel.style.position = 'fixed';
            panel.appendChild(handle);
            var isResizing = false, startX, startY, startW, startH;
            handle.addEventListener('mousedown', function(e) {
                isResizing = true;
                var rect = panel.getBoundingClientRect();
                panel.style.transform = 'none';
                panel.style.left = rect.left + 'px';
                panel.style.top = rect.top + 'px';
                startX = e.clientX; startY = e.clientY;
                startW = rect.width; startH = rect.height;
                e.preventDefault(); e.stopPropagation();
            });
            document.addEventListener('mousemove', function(e) {
                if (!isResizing) return;
                panel.style.width = Math.max(400, startW + e.clientX - startX) + 'px';
                panel.style.height = Math.max(300, startH + e.clientY - startY) + 'px';
            });
            document.addEventListener('mouseup', function() { if (isResizing) { isResizing = false; savePanelGeometry(); } });
        })();

        initEventHandlers();
    }

    // ---- Graph definition helpers (source/output flow model) ----
    function newFlowId() {
        return 'flow_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);
    }

    // Ensure a role object has the graph fields (source/output) for backward compat
    function ensureRoleGraphFields(role) {
        if (typeof role !== 'object' || role === null) return role;
        if (!role.source) role.source = { type: '', flowId: '', split: '' };
        if (!role.output) role.output = { flowId: newFlowId(), label: '' };
        else if (!role.output.flowId) role.output.flowId = newFlowId();
        return role;
    }

    // Return all published output flows across every group/role.
    // Each node auto-publishes one flow (label defaults to role name).
    function getPublishedFlows(excludeGi, excludeRi) {
        var flows = [];
        if (!engineSettings.groups) return flows;
        engineSettings.groups.forEach(function(g, gi) {
            if (!g.roles) return;
            g.roles.forEach(function(r, ri) {
                if (typeof r !== 'object') return;
                if (gi === excludeGi && ri === excludeRi) return; // a node can't source from itself
                if (!r.connected) return; // only connected nodes publish flows
                ensureRoleGraphFields(r);
                flows.push({
                    flowId: r.output.flowId,
                    label: r.output.label || r.name || '(unnamed role)',
                    groupName: g.name || 'Unnamed Group',
                    gi: gi, ri: ri
                });
            });
        });
        return flows;
    }

    // Compile groups/roles into a graph: nodes, flows, edges, sources.
    function compileGraph() {
        var nodes = [];
        var flows = [];
        var edges = [];
        var sources = [];
        var flowById = {};

        (engineSettings.groups || []).forEach(function(g, gi) {
            (g.roles || []).forEach(function(r, ri) {
                if (typeof r !== 'object') return;
                if (!r.connected) return; // disconnected nodes don't affect flow, not in the graph
                ensureRoleGraphFields(r);
                var nodeId = r.output.flowId; // stable 1:1 identity
                var node = {
                    id: nodeId,
                    gi: gi, ri: ri,
                    name: r.name || '(unnamed role)',
                    group: g.name || 'Unnamed Group',
                    rate: parseFloat(r.rate) || 0,
                    formula: r.formula || '',
                    station: r.station || '',
                    aiRules: r.aiRules || '',
                    source: r.source || { type: '', flowId: '', split: '' },
                    output: r.output
                };
                nodes.push(node);
                var flow = { flowId: r.output.flowId, label: r.output.label || node.name, producer: nodeId };
                flows.push(flow);
                flowById[flow.flowId] = flow;
                if (r.source && r.source.type === 'inbound') sources.push(nodeId);
            });
        });

        // Build edges: consumer.source.flowId -> consumer node
        nodes.forEach(function(n) {
            if (n.source && n.source.type === 'flow' && n.source.flowId) {
                var split = (n.source.split === '' || n.source.split === undefined) ? 100 : parseFloat(n.source.split);
                edges.push({
                    fromNodeId: flowById[n.source.flowId] ? flowById[n.source.flowId].producer : null,
                    toNodeId: n.id,
                    flowId: n.source.flowId,
                    split: isNaN(split) ? 100 : split
                });
            }
        });

        return { nodes: nodes, flows: flows, edges: edges, sources: sources, flowById: flowById };
    }

    // Validate a compiled graph. Returns { errors: [], warnings: [] }.
    function validateGraph(graph) {
        var errors = [];
        var warnings = [];
        var g = graph || compileGraph();

        if (g.nodes.length === 0) { warnings.push('No nodes defined yet.'); return { errors: errors, warnings: warnings }; }

        // 1. Every flow-source references an existing flow
        g.nodes.forEach(function(n) {
            if (n.source && n.source.type === 'flow') {
                if (!n.source.flowId) errors.push('"' + n.name + '" has source type Flow but no flow selected.');
                else if (!g.flowById[n.source.flowId]) errors.push('"' + n.name + '" references a flow that no longer exists.');
            }
            if (!n.source || !n.source.type) warnings.push('"' + n.name + '" has no source set.');
        });

        // 2. Splits per flow sum to <= 100%
        var splitByFlow = {};
        g.edges.forEach(function(e) {
            splitByFlow[e.flowId] = (splitByFlow[e.flowId] || 0) + (e.split || 0);
        });
        Object.keys(splitByFlow).forEach(function(fid) {
            if (splitByFlow[fid] > 100.001) {
                var label = g.flowById[fid] ? g.flowById[fid].label : fid;
                errors.push('Flow "' + label + '" is over-allocated: consumers take ' + splitByFlow[fid].toFixed(1) + '% (max 100%).');
            }
        });

        // 3. Orphan check: a node that is neither inbound-sourced, flow-sourced, nor consumed by anyone
        var consumedFlowIds = {};
        g.edges.forEach(function(e) { consumedFlowIds[e.flowId] = true; });
        g.nodes.forEach(function(n) {
            var hasSource = n.source && n.source.type;
            var isConsumed = consumedFlowIds[n.output.flowId];
            if (!hasSource && !isConsumed) warnings.push('"' + n.name + '" is orphaned (no source and nothing consumes its output).');
        });

        // 4. Cycle detection (DFS over edges fromNodeId -> toNodeId)
        var adj = {};
        g.edges.forEach(function(e) {
            if (!e.fromNodeId) return;
            (adj[e.fromNodeId] = adj[e.fromNodeId] || []).push(e.toNodeId);
        });
        var WHITE = 0, GRAY = 1, BLACK = 2;
        var color = {};
        g.nodes.forEach(function(n) { color[n.id] = WHITE; });
        var nameById = {};
        g.nodes.forEach(function(n) { nameById[n.id] = n.name; });
        var cycleFound = false;
        function dfs(u) {
            color[u] = GRAY;
            (adj[u] || []).forEach(function(v) {
                if (color[v] === GRAY) { cycleFound = true; }
                else if (color[v] === WHITE) dfs(v);
            });
            color[u] = BLACK;
        }
        g.nodes.forEach(function(n) { if (color[n.id] === WHITE) dfs(n.id); });
        if (cycleFound) errors.push('Graph contains a cycle (a node ultimately feeds back into itself). Flow must be acyclic.');

        return { errors: errors, warnings: warnings };
    }

    function openGraphCheckModal() {
        collectGroupsFromDOM();
        var graph = compileGraph();
        var result = validateGraph(graph);
        var existing = document.getElementById('he-graph-modal');
        if (existing) existing.remove();

        var listHtml = function(items, color, icon) {
            if (!items.length) return '';
            return items.map(function(t) {
                return '<div style="display:flex;gap:8px;padding:4px 0;font-size:12px;color:' + color + '"><span>' + icon + '</span><span>' + t + '</span></div>';
            }).join('');
        };

        var statusLine;
        if (result.errors.length) statusLine = '<span style="color:#f85149;font-weight:600">✗ ' + result.errors.length + ' error(s)</span>';
        else if (result.warnings.length) statusLine = '<span style="color:#e3b341;font-weight:600">⚠ Valid with ' + result.warnings.length + ' warning(s)</span>';
        else statusLine = '<span style="color:#3fb950;font-weight:600">✓ Graph is valid</span>';

        var modal = document.createElement('div');
        modal.id = 'he-graph-modal';
        modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:100001;display:flex;align-items:center;justify-content:center';
        modal.innerHTML =
            '<div style="background:var(--he-panel);border:1px solid var(--he-border);border-radius:10px;padding:20px;min-width:460px;max-width:640px;max-height:80vh;overflow-y:auto;box-shadow:0 8px 30px rgba(0,0,0,0.8)">' +
                '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">' +
                    '<span style="font-size:14px;font-weight:600;color:var(--he-text)">Graph Check</span>' +
                    '<button id="he-graph-close" style="background:none;border:none;color:var(--he-muted);font-size:18px;cursor:pointer">✕</button>' +
                '</div>' +
                '<div style="margin-bottom:12px;font-size:13px">' + statusLine + '</div>' +
                '<div style="display:flex;gap:16px;margin-bottom:12px;font-size:11px;color:var(--he-muted)">' +
                    '<span>' + graph.nodes.length + ' nodes</span>' +
                    '<span>' + graph.edges.length + ' edges</span>' +
                    '<span>' + graph.sources.length + ' inbound source(s)</span>' +
                '</div>' +
                (result.errors.length ? '<div style="margin-bottom:8px;font-size:11px;text-transform:uppercase;color:var(--he-muted);letter-spacing:1px">Errors</div>' + listHtml(result.errors, '#f85149', '✗') : '') +
                (result.warnings.length ? '<div style="margin:10px 0 8px;font-size:11px;text-transform:uppercase;color:var(--he-muted);letter-spacing:1px">Warnings</div>' + listHtml(result.warnings, '#e3b341', '⚠') : '') +
                (!result.errors.length && !result.warnings.length ? '<div style="color:#3fb950;font-size:12px">Every node is wired, splits are within limits, and the flow is acyclic.</div>' : '') +
                '<div style="display:flex;justify-content:flex-end;margin-top:16px">' +
                    '<button id="he-graph-ok" style="padding:6px 14px;background:#1f6feb;border:none;border-radius:6px;color:#fff;font-size:12px;cursor:pointer">Close</button>' +
                '</div>' +
            '</div>';
        document.body.appendChild(modal);
        document.getElementById('he-graph-close').addEventListener('click', function() { modal.remove(); });
        document.getElementById('he-graph-ok').addEventListener('click', function() { modal.remove(); });
        modal.addEventListener('click', function(e) { if (e.target === modal) modal.remove(); });
    }

    function renderGroups() {
        if (!engineSettings.groups) engineSettings.groups = [];
        var container = document.getElementById('he-groups-list');
        if (!container) return;
        if (engineSettings.groups.length === 0) {
            container.innerHTML = '<div style="color:#555;text-align:center;padding:30px;font-size:12px">No groups defined yet. Click + Add Group.</div>';
            return;
        }
        var html = '';
        engineSettings.groups.forEach(function(g, gi) {
            html += '<div style="margin-bottom:10px;border:1px solid ' + (g.color || 'var(--he-border)') + ';border-radius:6px;overflow:hidden">';
            // Group header
            html += '<div style="display:flex;align-items:center;gap:8px;padding:6px 10px;background:' + (g.color || 'var(--he-border)') + '22">';
            html += '<input type="color" class="he-grp-color" data-gi="' + gi + '" value="' + (g.color || '#6b21a8') + '" style="width:20px;height:20px;border:none;padding:0;cursor:pointer;background:none">';
            html += '<input type="text" class="he-grp-name" data-gi="' + gi + '" value="' + (g.name || '') + '" placeholder="Group name" style="flex:1;padding:3px 6px;background:transparent;border:none;border-bottom:1px solid var(--he-border);color:var(--he-text);font-size:12px;font-weight:600">';
            html += '<button class="he-grp-add-role" data-gi="' + gi + '" style="padding:2px 6px;background:#1f6feb;border:none;border-radius:3px;color:#fff;font-size:9px;cursor:pointer">+ Role</button>';
            html += '<button class="he-grp-del" data-gi="' + gi + '" style="padding:2px 6px;background:#da3633;border:none;border-radius:3px;color:#fff;font-size:9px;cursor:pointer">✕</button>';
            html += '</div>';
            // MHE selector — which MHE's Sort Length drives this group's Hourly math
            (function() {
                var am = autoMatchMhe(g.name);
                var s = '<div style="display:flex;align-items:center;gap:6px;padding:3px 10px;background:' + (g.color || 'var(--he-border)') + '11;font-size:10px;color:var(--he-muted)">';
                s += '<span style="white-space:nowrap">Hourly sort length:</span>';
                s += '<select class="he-grp-mhe" data-gi="' + gi + '" style="flex:1;padding:2px 4px;background:var(--he-bg);border:1px solid var(--he-border);border-radius:3px;color:var(--he-text);font-size:10px">';
                s += '<option value=""' + (!g.mhe ? ' selected' : '') + '>Auto' + (am ? ' \u2192 ' + am : ' (total sort)') + '</option>';
                s += '<option value="__total__"' + (g.mhe === '__total__' ? ' selected' : '') + '>Total sort length</option>';
                (engineSettings.mheTypes || []).forEach(function(m) {
                    s += '<option value="' + m + '"' + (g.mhe === m ? ' selected' : '') + '>' + m + '</option>';
                });
                s += '</select></div>';
                html += s;
            })();
            // Roles
            if (g.roles && g.roles.length > 0) {
                g.roles.forEach(function(r, ri) {
                    var roleName = (typeof r === 'object') ? (r.name || '') : (r || '');
                    var roleFormula = (typeof r === 'object') ? (r.formula || '') : '';
                    var roleGE = (typeof r === 'object') ? (r.geRoles || '') : '';
                    var roleRate = (typeof r === 'object') ? (r.rate || '') : '';
                    // Auto-fill from engineer rates if empty and name matches
                    if (!roleRate && roleName && engineSettings.engineerRates) {
                        var match = engineSettings.engineerRates.find(function(er) { return er.desc === roleName; });
                        if (match) roleRate = match.rate;
                    }
                    var isGE = (engineSettings.planMode === 'golden-eye');
                    html += '<div style="display:flex;align-items:center;gap:6px;padding:4px 10px 4px 30px;border-top:1px solid var(--he-border2)">';
                    html += '<input type="text" class="he-role-name" data-gi="' + gi + '" data-ri="' + ri + '" value="' + roleName + '" placeholder="Role name" style="flex:1;padding:3px 6px;background:var(--he-bg);border:1px solid var(--he-border);border-radius:3px;color:var(--he-text);font-size:11px">';
                    html += '<input type="text" class="he-role-rate" data-gi="' + gi + '" data-ri="' + ri + '" value="' + roleRate + '" placeholder="Eng Rate" style="width:70px;padding:3px 6px;background:var(--he-bg);border:1px solid var(--he-border);border-radius:3px;color:var(--he-text);font-size:11px;text-align:center">';
                    if (isGE) {
                        html += '<button class="he-role-ge" data-gi="' + gi + '" data-ri="' + ri + '" style="padding:2px 6px;background:none;border:1px solid ' + (roleGE ? '#eab308' : 'var(--he-border)') + ';border-radius:3px;color:' + (roleGE ? '#eab308' : 'var(--he-muted)') + ';font-size:9px;cursor:pointer;font-weight:600" title="' + (roleGE || 'No GE roles') + '">GE</button>';
                    } else {
                        html += '<button class="he-role-formula" data-gi="' + gi + '" data-ri="' + ri + '" style="padding:2px 6px;background:none;border:1px solid ' + (roleFormula ? '#2ea043' : 'var(--he-border)') + ';border-radius:3px;color:' + (roleFormula ? '#2ea043' : 'var(--he-muted)') + ';font-size:9px;cursor:pointer" title="' + (roleFormula || 'No formula') + '">ƒx</button>';
                    }
                    var roleAI = (typeof r === 'object') ? (r.aiRules || '') : '';
                    var roleLocked = (typeof r === 'object') ? (r.locked || false) : false;
                    html += '<button class="he-role-ai" data-gi="' + gi + '" data-ri="' + ri + '" style="padding:2px 6px;background:none;border:1px solid ' + (roleAI ? '#60a5fa' : 'var(--he-border)') + ';border-radius:3px;color:' + (roleAI ? '#60a5fa' : 'var(--he-muted)') + ';font-size:9px;cursor:pointer" title="' + (roleAI ? 'AI rules set' : 'No AI rules') + '">AI</button>';
                    var roleStation = (typeof r === 'object') ? (r.station || '') : '';
                    html += '<button class="he-role-station" data-gi="' + gi + '" data-ri="' + ri + '" style="padding:2px 6px;background:none;border:1px solid ' + (roleStation ? '#f97316' : 'var(--he-border)') + ';border-radius:3px;color:' + (roleStation ? '#f97316' : 'var(--he-muted)') + ';font-size:9px;cursor:pointer" title="' + (roleStation || 'No station mapping') + '">ST</button>';
                    ensureRoleGraphFields(r);
                    var isConnected = !!r.connected;
                    var connTitle = isConnected ? 'Affects flow (in graph) — click to disconnect' : 'Does not affect flow — click to connect to graph';
                    html += '<button class="he-role-connect" data-gi="' + gi + '" data-ri="' + ri + '" style="padding:2px 6px;background:none;border:1px solid ' + (isConnected ? '#2dd4bf' : 'var(--he-border)') + ';border-radius:3px;color:' + (isConnected ? '#2dd4bf' : 'var(--he-muted)') + ';font-size:9px;cursor:pointer" title="' + connTitle + '">🔗</button>';
                    if (isConnected) {
                        var hasSource = r.source && r.source.type;
                        var srcTitle = !hasSource ? 'No source set' : (r.source.type === 'inbound' ? 'Source: Inbound data' : 'Source: flow');
                        html += '<button class="he-role-source" data-gi="' + gi + '" data-ri="' + ri + '" style="padding:2px 6px;background:none;border:1px solid ' + (hasSource ? '#2dd4bf' : 'var(--he-border)') + ';border-radius:3px;color:' + (hasSource ? '#2dd4bf' : 'var(--he-muted)') + ';font-size:9px;cursor:pointer" title="' + srcTitle + '">SRC</button>';
                        html += '<button class="he-role-output" data-gi="' + gi + '" data-ri="' + ri + '" style="padding:2px 6px;background:none;border:1px solid #a78bfa;border-radius:3px;color:#a78bfa;font-size:9px;cursor:pointer" title="Output flow: ' + (r.output.label || roleName || 'auto') + '">OUT</button>';
                    }
                    html += '<button class="he-role-lock" data-gi="' + gi + '" data-ri="' + ri + '" style="padding:2px 6px;background:none;border:1px solid ' + (roleLocked ? '#eab308' : 'var(--he-border)') + ';border-radius:3px;color:' + (roleLocked ? '#eab308' : 'var(--he-muted)') + ';font-size:9px;cursor:pointer" title="' + (roleLocked ? 'Locked' : 'Dynamic') + '">' + (roleLocked ? '🔒' : '🔓') + '</button>';
                    html += '<button class="he-role-del" data-gi="' + gi + '" data-ri="' + ri + '" style="padding:2px 5px;background:none;border:1px solid #da3633;border-radius:3px;color:#da3633;font-size:9px;cursor:pointer">✕</button>';
                    html += '</div>';
                });
            }
            html += '</div>';
        });
        container.innerHTML = html;
        attachGroupHandlers();
    }

    function collectGroupsFromDOM() {
        if (!engineSettings.groups) return;
        document.querySelectorAll('.he-grp-name').forEach(function(el) {
            var gi = parseInt(el.getAttribute('data-gi'));
            if (engineSettings.groups[gi]) engineSettings.groups[gi].name = el.value.trim();
        });
        document.querySelectorAll('.he-grp-color').forEach(function(el) {
            var gi = parseInt(el.getAttribute('data-gi'));
            if (engineSettings.groups[gi]) engineSettings.groups[gi].color = el.value;
        });
        document.querySelectorAll('.he-grp-mhe').forEach(function(el) {
            var gi = parseInt(el.getAttribute('data-gi'));
            if (engineSettings.groups[gi]) engineSettings.groups[gi].mhe = el.value;
        });
        document.querySelectorAll('.he-role-name').forEach(function(el) {
            var gi = parseInt(el.getAttribute('data-gi'));
            var ri = parseInt(el.getAttribute('data-ri'));
            if (engineSettings.groups[gi] && engineSettings.groups[gi].roles) {
                var existing = engineSettings.groups[gi].roles[ri];
                if (typeof existing === 'object') {
                    existing.name = el.value.trim();
                } else {
                    engineSettings.groups[gi].roles[ri] = { name: el.value.trim(), formula: '' };
                }
            }
        });
        document.querySelectorAll('.he-role-rate').forEach(function(el) {
            var gi = parseInt(el.getAttribute('data-gi'));
            var ri = parseInt(el.getAttribute('data-ri'));
            if (engineSettings.groups[gi] && engineSettings.groups[gi].roles) {
                var existing = engineSettings.groups[gi].roles[ri];
                if (typeof existing === 'object') { existing.rate = el.value.trim(); }
            }
        });
    }

    function attachGroupHandlers() {
        // Color/name changes save on blur
        document.querySelectorAll('.he-grp-name,.he-grp-color,.he-grp-mhe,.he-role-name,.he-role-rate').forEach(function(el) {
            el.addEventListener('change', function() { collectGroupsFromDOM(); saveSettings(); });
        });
        // Auto-fill eng rate when role name matches
        document.querySelectorAll('.he-role-name').forEach(function(el) {
            el.addEventListener('change', function() {
                var name = el.value.trim();
                if (!name || !engineSettings.engineerRates) return;
                var match = engineSettings.engineerRates.find(function(er) { return er.desc === name; });
                if (match) {
                    var gi = el.getAttribute('data-gi');
                    var ri = el.getAttribute('data-ri');
                    var rateEl = document.querySelector('.he-role-rate[data-gi="' + gi + '"][data-ri="' + ri + '"]');
                    if (rateEl) {
                        rateEl.value = match.rate;
                        collectGroupsFromDOM(); saveSettings();
                    }
                }
            });
        });
        // Add role
        document.querySelectorAll('.he-grp-add-role').forEach(function(btn) {
            btn.addEventListener('click', function() {
                collectGroupsFromDOM();
                var gi = parseInt(btn.getAttribute('data-gi'));
                if (!engineSettings.groups[gi].roles) engineSettings.groups[gi].roles = [];
                engineSettings.groups[gi].roles.push({ name: '', formula: '', rate: '', geRoles: '', aiRules: '', station: '', locked: true, area: '', variable: '', connected: false, source: { type: '', flowId: '', split: '' }, output: { flowId: newFlowId(), label: '' } });
                saveSettings(); renderGroups();
            });
        });
        // Delete group
        document.querySelectorAll('.he-grp-del').forEach(function(btn) {
            btn.addEventListener('click', function() {
                collectGroupsFromDOM();
                var gi = parseInt(btn.getAttribute('data-gi'));
                engineSettings.groups.splice(gi, 1);
                saveSettings(); renderGroups();
            });
        });
        // Delete role
        // AI rules button
        document.querySelectorAll('.he-role-ai').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault(); e.stopPropagation();
                collectGroupsFromDOM();
                var gi = parseInt(btn.getAttribute('data-gi'));
                var ri = parseInt(btn.getAttribute('data-ri'));
                var role = engineSettings.groups[gi].roles[ri];
                if (typeof role !== 'object') role = { name: role || '', formula: '', geRoles: '', aiRules: '', locked: false };
                openAIRulesModal(gi, ri, role);
            });
        });
        // Lock/Dynamic toggle
        // Station mapping button
        document.querySelectorAll('.he-role-station').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault(); e.stopPropagation();
                collectGroupsFromDOM();
                var gi = parseInt(btn.getAttribute('data-gi'));
                var ri = parseInt(btn.getAttribute('data-ri'));
                var role = engineSettings.groups[gi].roles[ri];
                if (typeof role !== 'object') role = { name: role || '', formula: '', geRoles: '', aiRules: '', station: '', locked: false };
                openStationModal(gi, ri, role);
            });
        });
        // Connect-to-graph toggle
        document.querySelectorAll('.he-role-connect').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault(); e.stopPropagation();
                collectGroupsFromDOM();
                var gi = parseInt(btn.getAttribute('data-gi'));
                var ri = parseInt(btn.getAttribute('data-ri'));
                var role = ensureRoleGraphFields(engineSettings.groups[gi].roles[ri]);
                role.connected = !role.connected;
                saveSettings(); renderGroups();
            });
        });
        // Source button
        document.querySelectorAll('.he-role-source').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault(); e.stopPropagation();
                collectGroupsFromDOM();
                var gi = parseInt(btn.getAttribute('data-gi'));
                var ri = parseInt(btn.getAttribute('data-ri'));
                var role = ensureRoleGraphFields(engineSettings.groups[gi].roles[ri]);
                openSourceModal(gi, ri, role);
            });
        });
        // Output button
        document.querySelectorAll('.he-role-output').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault(); e.stopPropagation();
                collectGroupsFromDOM();
                var gi = parseInt(btn.getAttribute('data-gi'));
                var ri = parseInt(btn.getAttribute('data-ri'));
                var role = ensureRoleGraphFields(engineSettings.groups[gi].roles[ri]);
                openOutputModal(gi, ri, role);
            });
        });
        document.querySelectorAll('.he-role-lock').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault(); e.stopPropagation();
                collectGroupsFromDOM();
                var gi = parseInt(btn.getAttribute('data-gi'));
                var ri = parseInt(btn.getAttribute('data-ri'));
                if (typeof engineSettings.groups[gi].roles[ri] !== 'object') {
                    engineSettings.groups[gi].roles[ri] = { name: engineSettings.groups[gi].roles[ri] || '', formula: '', geRoles: '', aiRules: '', locked: false };
                }
                engineSettings.groups[gi].roles[ri].locked = !engineSettings.groups[gi].roles[ri].locked;
                saveSettings();
                renderGroups();
            });
        });
        // GE roles button
        document.querySelectorAll('.he-role-ge').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault(); e.stopPropagation();
                collectGroupsFromDOM();
                var gi = parseInt(btn.getAttribute('data-gi'));
                var ri = parseInt(btn.getAttribute('data-ri'));
                var role = engineSettings.groups[gi].roles[ri];
                if (typeof role !== 'object') role = { name: role || '', formula: '', geRoles: '' };
                openGERolesModal(gi, ri, role);
            });
        });
        // Formula button
        document.querySelectorAll('.he-role-formula').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault(); e.stopPropagation();
                collectGroupsFromDOM();
                var gi = parseInt(btn.getAttribute('data-gi'));
                var ri = parseInt(btn.getAttribute('data-ri'));
                var role = engineSettings.groups[gi].roles[ri];
                if (typeof role !== 'object') role = { name: role || '', formula: '' };
                openFormulaModal(gi, ri, role);
            });
        });
        document.querySelectorAll('.he-role-del').forEach(function(btn) {
            btn.addEventListener('click', function() {
                collectGroupsFromDOM();
                var gi = parseInt(btn.getAttribute('data-gi'));
                var ri = parseInt(btn.getAttribute('data-ri'));
                engineSettings.groups[gi].roles.splice(ri, 1);
                saveSettings(); renderGroups();
            });
        });
    }

    function openStationModal(gi, ri, role) {
        var existing = document.getElementById('he-station-modal');
        if (existing) existing.remove();

        var modal = document.createElement('div');
        modal.id = 'he-station-modal';
        modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:100001;display:flex;align-items:center;justify-content:center';
        modal.innerHTML =
            '<div style="background:var(--he-panel);border:1px solid var(--he-border);border-radius:10px;padding:20px;min-width:380px;max-width:520px;box-shadow:0 8px 30px rgba(0,0,0,0.8)">' +
                '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">' +
                    '<span style="font-size:14px;font-weight:600;color:var(--he-text)">Station Mapping: ' + (role.name || 'Unnamed') + '</span>' +
                    '<button id="he-station-close" style="background:none;border:none;color:var(--he-muted);font-size:18px;cursor:pointer">✕</button>' +
                '</div>' +
                '<div style="margin-bottom:10px;color:var(--he-muted);font-size:11px">Enter the station/process segment names that map to this role (comma or space separated):</div>' +
                '<textarea id="he-station-input" style="width:100%;height:80px;padding:10px;background:var(--he-bg);border:1px solid var(--he-border);border-radius:6px;color:var(--he-text);font-family:-apple-system,sans-serif;font-size:12px;resize:vertical" placeholder="e.g. AR Induct, AR Container Build Lane 6/7, AR Waterspider">' + (role.station || '') + '</textarea>' +
                '<div style="display:flex;justify-content:flex-end;gap:8px;margin-top:14px">' +
                    '<button id="he-station-cancel" style="padding:6px 14px;background:none;border:1px solid var(--he-border);border-radius:6px;color:var(--he-muted);font-size:12px;cursor:pointer">Cancel</button>' +
                    '<button id="he-station-save" style="padding:6px 14px;background:#1f6feb;border:none;border-radius:6px;color:#fff;font-size:12px;cursor:pointer">Save</button>' +
                '</div>' +
            '</div>';
        document.body.appendChild(modal);

        document.getElementById('he-station-close').addEventListener('click', function() { modal.remove(); });
        document.getElementById('he-station-cancel').addEventListener('click', function() { modal.remove(); });
        modal.addEventListener('click', function(e) { if (e.target === modal) modal.remove(); });
        document.getElementById('he-station-save').addEventListener('click', function() {
            var val = document.getElementById('he-station-input').value.trim();
            if (typeof engineSettings.groups[gi].roles[ri] !== 'object') {
                engineSettings.groups[gi].roles[ri] = { name: '', formula: '', geRoles: '', aiRules: '', station: '', locked: false };
            }
            engineSettings.groups[gi].roles[ri].station = val;
            saveSettings();
            modal.remove();
            renderGroups();
        });
    }

    function openSourceModal(gi, ri, role) {
        var existing = document.getElementById('he-source-modal');
        if (existing) existing.remove();
        ensureRoleGraphFields(role);
        var src = role.source || { type: '', flowId: '', split: '' };
        var flows = getPublishedFlows(gi, ri);

        var flowOptions = '<option value="">— select a flow —</option>';
        flows.forEach(function(f) {
            var sel = (src.flowId === f.flowId) ? ' selected' : '';
            flowOptions += '<option value="' + f.flowId + '"' + sel + '>' + f.label + '  (' + f.groupName + ')</option>';
        });

        var modal = document.createElement('div');
        modal.id = 'he-source-modal';
        modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:100001;display:flex;align-items:center;justify-content:center';
        modal.innerHTML =
            '<div style="background:var(--he-panel);border:1px solid var(--he-border);border-radius:10px;padding:20px;min-width:400px;max-width:540px;box-shadow:0 8px 30px rgba(0,0,0,0.8)">' +
                '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">' +
                    '<span style="font-size:14px;font-weight:600;color:var(--he-text)">Source: ' + (role.name || 'Unnamed') + '</span>' +
                    '<button id="he-source-close" style="background:none;border:none;color:var(--he-muted);font-size:18px;cursor:pointer">✕</button>' +
                '</div>' +
                '<div style="margin-bottom:10px;color:var(--he-muted);font-size:11px">Where does the volume feeding this node come from?</div>' +
                '<label style="display:flex;align-items:center;gap:8px;margin-bottom:8px;color:var(--he-text);font-size:12px;cursor:pointer">' +
                    '<input type="radio" name="he-src-type" value="inbound"' + (src.type === 'inbound' ? ' checked' : '') + '> Inbound data (raw volume entry point)' +
                '</label>' +
                '<label style="display:flex;align-items:center;gap:8px;margin-bottom:8px;color:var(--he-text);font-size:12px;cursor:pointer">' +
                    '<input type="radio" name="he-src-type" value="flow"' + (src.type === 'flow' ? ' checked' : '') + '> A defined Flow (another node\'s output)' +
                '</label>' +
                '<div id="he-src-flow-wrap" style="margin:8px 0 0 24px;' + (src.type === 'flow' ? '' : 'display:none') + '">' +
                    '<label style="display:block;font-size:11px;color:var(--he-muted);margin-bottom:3px">Flow</label>' +
                    '<select id="he-src-flow" style="width:100%;padding:6px;background:var(--he-bg);border:1px solid var(--he-border);border-radius:4px;color:var(--he-text);font-size:12px;margin-bottom:10px">' + flowOptions + '</select>' +
                    '<label style="display:block;font-size:11px;color:var(--he-muted);margin-bottom:3px">Split % of that flow taken by this node</label>' +
                    '<input id="he-src-split" type="text" value="' + (src.split || '') + '" placeholder="e.g. 75 (leave blank for 100%)" style="width:100%;box-sizing:border-box;padding:6px;background:var(--he-bg);border:1px solid var(--he-border);border-radius:4px;color:var(--he-text);font-size:12px">' +
                    (flows.length === 0 ? '<div style="color:#e3b341;font-size:11px;margin-top:8px">⚠ No other node outputs published yet. Define outputs on other roles first.</div>' : '') +
                '</div>' +
                '<div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px">' +
                    '<button id="he-source-cancel" style="padding:6px 14px;background:none;border:1px solid var(--he-border);border-radius:6px;color:var(--he-muted);font-size:12px;cursor:pointer">Cancel</button>' +
                    '<button id="he-source-save" style="padding:6px 14px;background:#1f6feb;border:none;border-radius:6px;color:#fff;font-size:12px;cursor:pointer">Save</button>' +
                '</div>' +
            '</div>';
        document.body.appendChild(modal);

        // Toggle flow picker visibility with radio selection
        modal.querySelectorAll('input[name="he-src-type"]').forEach(function(radio) {
            radio.addEventListener('change', function() {
                document.getElementById('he-src-flow-wrap').style.display = (radio.value === 'flow' && radio.checked) ? '' : 'none';
            });
        });

        document.getElementById('he-source-close').addEventListener('click', function() { modal.remove(); });
        document.getElementById('he-source-cancel').addEventListener('click', function() { modal.remove(); });
        modal.addEventListener('click', function(e) { if (e.target === modal) modal.remove(); });
        document.getElementById('he-source-save').addEventListener('click', function() {
            var checked = modal.querySelector('input[name="he-src-type"]:checked');
            var type = checked ? checked.value : '';
            var flowId = (type === 'flow') ? document.getElementById('he-src-flow').value : '';
            var split = (type === 'flow') ? document.getElementById('he-src-split').value.trim() : '';
            ensureRoleGraphFields(engineSettings.groups[gi].roles[ri]);
            engineSettings.groups[gi].roles[ri].source = { type: type, flowId: flowId, split: split };
            saveSettings();
            modal.remove();
            renderGroups();
        });
    }

    function openOutputModal(gi, ri, role) {
        var existing = document.getElementById('he-output-modal');
        if (existing) existing.remove();
        ensureRoleGraphFields(role);
        var out = role.output;
        // Who consumes this flow?
        var consumers = [];
        (engineSettings.groups || []).forEach(function(g) {
            (g.roles || []).forEach(function(r) {
                if (typeof r === 'object' && r.source && r.source.type === 'flow' && r.source.flowId === out.flowId) {
                    consumers.push((r.name || '(unnamed role)') + (r.source.split ? ' @ ' + r.source.split + '%' : ''));
                }
            });
        });

        var modal = document.createElement('div');
        modal.id = 'he-output-modal';
        modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:100001;display:flex;align-items:center;justify-content:center';
        modal.innerHTML =
            '<div style="background:var(--he-panel);border:1px solid var(--he-border);border-radius:10px;padding:20px;min-width:400px;max-width:540px;box-shadow:0 8px 30px rgba(0,0,0,0.8)">' +
                '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">' +
                    '<span style="font-size:14px;font-weight:600;color:var(--he-text)">Output: ' + (role.name || 'Unnamed') + '</span>' +
                    '<button id="he-output-close" style="background:none;border:none;color:var(--he-muted);font-size:18px;cursor:pointer">✕</button>' +
                '</div>' +
                '<div style="margin-bottom:10px;color:var(--he-muted);font-size:11px">This node automatically publishes a flow that other nodes can select as their source. The output rate is defined by this role\'s formula / engineer rate.</div>' +
                '<label style="display:block;font-size:11px;color:var(--he-muted);margin-bottom:3px">Flow label (defaults to role name)</label>' +
                '<input id="he-output-label" type="text" value="' + (out.label || '') + '" placeholder="' + (role.name || 'Role name') + '" style="width:100%;box-sizing:border-box;padding:6px;background:var(--he-bg);border:1px solid var(--he-border);border-radius:4px;color:var(--he-text);font-size:12px;margin-bottom:12px">' +
                '<div style="font-size:11px;color:var(--he-muted);margin-bottom:4px">Consumed by:</div>' +
                '<div style="background:var(--he-bg);border:1px solid var(--he-border2);border-radius:6px;padding:8px;font-size:11px;color:var(--he-text);min-height:24px">' +
                    (consumers.length ? consumers.join('<br>') : '<span style="color:#6e7681">Nothing consumes this flow yet</span>') +
                '</div>' +
                '<div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px">' +
                    '<button id="he-output-cancel" style="padding:6px 14px;background:none;border:1px solid var(--he-border);border-radius:6px;color:var(--he-muted);font-size:12px;cursor:pointer">Cancel</button>' +
                    '<button id="he-output-save" style="padding:6px 14px;background:#1f6feb;border:none;border-radius:6px;color:#fff;font-size:12px;cursor:pointer">Save</button>' +
                '</div>' +
            '</div>';
        document.body.appendChild(modal);

        document.getElementById('he-output-close').addEventListener('click', function() { modal.remove(); });
        document.getElementById('he-output-cancel').addEventListener('click', function() { modal.remove(); });
        modal.addEventListener('click', function(e) { if (e.target === modal) modal.remove(); });
        document.getElementById('he-output-save').addEventListener('click', function() {
            ensureRoleGraphFields(engineSettings.groups[gi].roles[ri]);
            engineSettings.groups[gi].roles[ri].output.label = document.getElementById('he-output-label').value.trim();
            saveSettings();
            modal.remove();
            renderGroups();
        });
    }

    function openAIRulesModal(gi, ri, role) {
        var existing = document.getElementById('he-ai-modal');
        if (existing) existing.remove();

        var modal = document.createElement('div');
        modal.id = 'he-ai-modal';
        modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:100001;display:flex;align-items:center;justify-content:center';
        modal.innerHTML =
            '<div style="background:var(--he-panel);border:1px solid var(--he-border);border-radius:10px;padding:20px;min-width:380px;max-width:520px;box-shadow:0 8px 30px rgba(0,0,0,0.8)">' +
                '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">' +
                    '<span style="font-size:14px;font-weight:600;color:var(--he-text)">AI Rules: ' + (role.name || 'Unnamed') + '</span>' +
                    '<button id="he-ai-close" style="background:none;border:none;color:var(--he-muted);font-size:18px;cursor:pointer">✕</button>' +
                '</div>' +
                '<div style="margin-bottom:10px;color:var(--he-muted);font-size:11px">Enter rules for the AI to follow when allocating headcount for this role. One rule per line.</div>' +
                '<textarea id="he-ai-input" style="width:100%;height:120px;padding:10px;background:var(--he-bg);border:1px solid var(--he-border);border-radius:6px;color:var(--he-text);font-family:-apple-system,sans-serif;font-size:12px;resize:vertical" placeholder="e.g.\nMinimum 2 HC at all times\nScale with volume above 5000 TPH\nDo not exceed 8 HC">' + (role.aiRules || '') + '</textarea>' +
                '<div style="display:flex;justify-content:flex-end;gap:8px;margin-top:14px">' +
                    '<button id="he-ai-cancel" style="padding:6px 14px;background:none;border:1px solid var(--he-border);border-radius:6px;color:var(--he-muted);font-size:12px;cursor:pointer">Cancel</button>' +
                    '<button id="he-ai-save" style="padding:6px 14px;background:#1f6feb;border:none;border-radius:6px;color:#fff;font-size:12px;cursor:pointer">Save</button>' +
                '</div>' +
            '</div>';
        document.body.appendChild(modal);

        document.getElementById('he-ai-close').addEventListener('click', function() { modal.remove(); });
        document.getElementById('he-ai-cancel').addEventListener('click', function() { modal.remove(); });
        modal.addEventListener('click', function(e) { if (e.target === modal) modal.remove(); });
        document.getElementById('he-ai-save').addEventListener('click', function() {
            var val = document.getElementById('he-ai-input').value.trim();
            if (typeof engineSettings.groups[gi].roles[ri] !== 'object') {
                engineSettings.groups[gi].roles[ri] = { name: '', formula: '', geRoles: '', aiRules: '', locked: false };
            }
            engineSettings.groups[gi].roles[ri].aiRules = val;
            saveSettings();
            modal.remove();
            renderGroups();
        });
    }

    function openGERolesModal(gi, ri, role) {
        var existing = document.getElementById('he-ge-modal');
        if (existing) existing.remove();

        var modal = document.createElement('div');
        modal.id = 'he-ge-modal';
        modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:100001;display:flex;align-items:center;justify-content:center';
        modal.innerHTML =
            '<div style="background:var(--he-panel);border:1px solid var(--he-border);border-radius:10px;padding:20px;min-width:350px;max-width:500px;box-shadow:0 8px 30px rgba(0,0,0,0.8)">' +
                '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">' +
                    '<span style="font-size:14px;font-weight:600;color:var(--he-text)">Golden Eye Roles: ' + (role.name || 'Unnamed') + '</span>' +
                    '<button id="he-ge-close" style="background:none;border:none;color:var(--he-muted);font-size:18px;cursor:pointer">✕</button>' +
                '</div>' +
                '<div style="margin-bottom:10px;color:var(--he-muted);font-size:11px">Enter Golden Eye role names, separated by commas or spaces:</div>' +
                '<textarea id="he-ge-input" style="width:100%;height:80px;padding:10px;background:var(--he-bg);border:1px solid var(--he-border);border-radius:6px;color:var(--he-text);font-family:-apple-system,sans-serif;font-size:12px;resize:vertical" placeholder="e.g. Cont. Unload, Shuttle Dump, Jam Breaker">' + (role.geRoles || '') + '</textarea>' +
                '<div style="display:flex;justify-content:flex-end;gap:8px;margin-top:14px">' +
                    '<button id="he-ge-cancel" style="padding:6px 14px;background:none;border:1px solid var(--he-border);border-radius:6px;color:var(--he-muted);font-size:12px;cursor:pointer">Cancel</button>' +
                    '<button id="he-ge-save" style="padding:6px 14px;background:#1f6feb;border:none;border-radius:6px;color:#fff;font-size:12px;cursor:pointer">Save</button>' +
                '</div>' +
            '</div>';
        document.body.appendChild(modal);

        document.getElementById('he-ge-close').addEventListener('click', function() { modal.remove(); });
        document.getElementById('he-ge-cancel').addEventListener('click', function() { modal.remove(); });
        modal.addEventListener('click', function(e) { if (e.target === modal) modal.remove(); });
        document.getElementById('he-ge-save').addEventListener('click', function() {
            var val = document.getElementById('he-ge-input').value.trim();
            if (typeof engineSettings.groups[gi].roles[ri] !== 'object') {
                engineSettings.groups[gi].roles[ri] = { name: '', formula: '', geRoles: '' };
            }
            engineSettings.groups[gi].roles[ri].geRoles = val;
            saveSettings();
            modal.remove();
            renderGroups();
        });
    }

    // Package-size formula variables. v = variable token; bd = packageBreakdown
    // key / volumeMixPackages key; mix = Volume Mix row label (per-MHE %).
    var FORMULA_SIZE_VARS = [
        { v: 'xs',  bd: 'extraSmall',  mix: 'Extra Small' },
        { v: 's',   bd: 'small',       mix: 'Small' },
        { v: 'm',   bd: 'medium',      mix: 'Medium' },
        { v: 'l',   bd: 'large',       mix: 'Large' },
        { v: 'xl',  bd: 'extraLarge',  mix: 'Extra Large' },
        { v: 'nc',  bd: 'nonCon',      mix: 'Non-Con' },
        { v: 'ncp', bd: 'nonConPlus',  mix: 'Non-Con Plus' }
    ];
    var FORMULA_MHE_ATTRS = ['Hourly Throughput','Container Build %','Fluid Load %','Direct to Container %',
        'Shuttle Volume %','Pallet Volume %','Cart Volume %','Bag Volume %',
        'Chute - Lanes Volume %','Chute - OB Volume %','Runout Volume %',
        'Packages per Shuttle','Packages per Pallet','Packages per Cart','Packages per Bag'];

    // Total packages of a given size = exported counts if present, else
    // Sort Volume Goal x packageBreakdown %.
    // Sum of exported inbound package counts (the "data pull" total).
    function ibDataPullTotal() {
        var vmp = (engineSettings.planVars || {}).volumeMixPackages;
        if (!vmp) return 0;
        var t = 0;
        FORMULA_SIZE_VARS.forEach(function(s) { t += parseFloat(vmp[s.bd]) || 0; });
        return t;
    }

    // Effective planning volume per mode:
    //  - simple/scaling: the manually-entered Sort Volume Goal
    //  - exact: the inbound data-pull total
    function ibEffectiveVolume() {
        if (engineSettings.planMode === 'exact') return ibDataPullTotal();
        return parseFloat((engineSettings.planVars || {}).sortVolumeGoal) || 0;
    }

    // Operational Length = Sort Length - Start Up & Break (the working hours).
    function ibOperationalLength() {
        return ibOpLengthFor(null);
    }

    // Operational length for a specific MHE: uses that MHE's Sort Length when
    // set (> 0), otherwise the global Sort Length; minus Start Up & Break.
    function ibOpLengthFor(mhe) {
        var pv = engineSettings.planVars || {};
        var breakUp = parseFloat(pv.startUpBreak) || 0;
        var msl = mhe ? parseFloat((engineSettings.mheSortLength || {})[mhe]) : NaN;
        var sortLen = (!isNaN(msl) && msl > 0) ? msl : (parseFloat(pv.sortLength) || 0);
        return Math.max(0, sortLen - breakUp);
    }

    // Best-guess MHE for a group from its name (e.g. "Linear" -> "Linear Sorter").
    function autoMatchMhe(name) {
        if (!name) return '';
        var gn = name.toLowerCase();
        var match = '';
        (engineSettings.mheTypes || []).forEach(function(m) {
            var mn = (m || '').toLowerCase();
            if (!mn) return;
            var mnShort = mn.replace(/sorter/g, '').trim();
            if (gn.indexOf(mn) !== -1 || mn.indexOf(gn) !== -1 || (mnShort && gn.indexOf(mnShort) !== -1)) match = m;
        });
        return match;
    }

    // Resolve which MHE a group maps to. g.mhe values:
    //   '__total__'  -> use total (global) sort length
    //   '<MHE name>' -> that MHE
    //   unset/''     -> auto-match by group name (falls back to global)
    function resolveGroupMhe(g) {
        if (!g) return '';
        if (g.mhe === '__total__') return '';
        if (g.mhe) return g.mhe;
        return autoMatchMhe(g.name);
    }

    // Total non-con volume: exact mode = exact NC + NC+ counts, else the
    // manually-entered Sort Non-Con Volume Goal.
    function ibSortNonConGoal() {
        if (engineSettings.planMode === 'exact') {
            return ibSizeTotal('nonCon') + ibSizeTotal('nonConPlus');
        }
        return parseFloat((engineSettings.planVars || {}).sortNonConVolumeGoal) || 0;
    }

    // Total packages of a given size, per plan mode:
    //  - simple:  effective volume x Plan-Mode Mix %  (manual mix)
    //  - scaling: manual volume x data-derived mix %  (mix from IB pull)
    //  - exact:   exact IB pull count for the size
    function ibSizeTotal(bdKey) {
        var pv = engineSettings.planVars || {};
        var mode = engineSettings.planMode || 'simple';
        var vmp = pv.volumeMixPackages || null;
        if (mode === 'exact') {
            return (vmp && vmp[bdKey] !== undefined && vmp[bdKey] !== '') ? (parseFloat(vmp[bdKey]) || 0) : 0;
        }
        if (mode === 'scaling') {
            var vol = parseFloat(pv.sortVolumeGoal) || 0;
            var tot = ibDataPullTotal();
            var cnt = vmp ? (parseFloat(vmp[bdKey]) || 0) : 0;
            return tot > 0 ? vol * (cnt / tot) : 0;
        }
        // simple
        var vol2 = parseFloat(pv.sortVolumeGoal) || 0;
        var bd = engineSettings.packageBreakdown || {};
        var pct = parseFloat(bd[bdKey]) || 0;
        return vol2 * pct / 100;
    }

    // Fluid / containerized volume, per plan mode (mirrors ibSizeTotal):
    //  - simple:  Sort Volume Goal x Settings Fluid/Containerized %
    //  - scaling: exported count scaled by the same factor as package sizes
    //             (Sort Volume Goal / data pull total)
    //  - exact:   the exported count as-is
    function ibFcVolume(key) {
        var pv = engineSettings.planVars || {};
        var mode = engineSettings.planMode || 'simple';
        if (mode === 'scaling') {
            var vol = parseFloat(pv.sortVolumeGoal) || 0;
            var tot = ibDataPullTotal();
            var raw = parseFloat(pv[key]) || 0;
            return tot > 0 ? vol * (raw / tot) : 0;
        }
        if (mode === 'exact') return parseFloat(pv[key]) || 0;
        // simple: hardcoded % from Settings > Package Breakdown
        var fc = engineSettings.fcBreakdown || {};
        var fcKey = (key === 'fluidVolume') ? 'fluid' : 'containerized';
        var pct = parseFloat(fc[fcKey]) || 0;
        return (parseFloat(pv.sortVolumeGoal) || 0) * pct / 100;
    }

    // Total volume routed to an MHE = sum over sizes of size total x that MHE's
    // Volume Mix %. Used by Volume Targets and the {MHE}-hourly formula vars.
    function ibMheVolume(mhe) {
        var vmix = engineSettings.volumeMix || {};
        var total = 0;
        FORMULA_SIZE_VARS.forEach(function(s) {
            var mixPct = parseFloat(vmix[mhe + '|' + s.mix]) || 0;
            total += ibSizeTotal(s.bd) * mixPct / 100;
        });
        return total;
    }

    // Grouped variable catalog — used to render the ƒx picker in labeled
    // sections. getFormulaVariables() flattens this, so this is the single
    // source of truth for which variables exist.
    function getFormulaVariableGroups() {
        var groups = [];
        groups.push({ label: 'General', vars: ['volume', 'Variable', 'sortLength', 'engRate', 'problemSolvePct', 'problemSolveVolume', 'jackpotPct', 'jackpotVolume', 'fluidVolume', 'containerizedVolume', 'crossdockContainers'] });
        groups.push({ label: 'Sizes (total pkgs)', vars: FORMULA_SIZE_VARS.map(function(s) { return s.v; }) });
        (engineSettings.mheTypes || []).forEach(function(mhe) {
            var slug = mhe.replace(/\s+/g, '-');
            var mvars = [slug + '-total', slug + '-Sort-Length'];
            FORMULA_SIZE_VARS.forEach(function(s) { mvars.push(slug + '-' + s.v); });
            FORMULA_MHE_ATTRS.forEach(function(attr) {
                mvars.push(slug + '-' + attr.replace(/[\s%]+/g, '-').replace(/-+$/, ''));
            });
            groups.push({ label: mhe, vars: mvars });
        });
        return groups;
    }

    function getFormulaVariables() {
        // Only variables the engine can actually resolve are exposed.
        var vars = [];
        getFormulaVariableGroups().forEach(function(g) {
            g.vars.forEach(function(v) { vars.push(v); });
        });
        return vars;
    }

    // Resolve a formula variable name to its current numeric value
    function resolveFormulaVarValue(varName) {
        var pv = engineSettings.planVars || {};
        if (varName === 'volume') return ibEffectiveVolume();
        if (varName === 'sortLength') return ibOperationalLength();
        if (varName === 'engRate') return 0; // substituted per-role in evaluateRoleFormula
        // Problem Solve / Jackpot (mirror the Sort Details & KPIs computations)
        if (varName === 'problemSolvePct') return parseFloat(pv.problemSolvePct) || 0;
        if (varName === 'problemSolveVolume') return ibEffectiveVolume() * (parseFloat(pv.problemSolvePct) || 0) / 100;
        if (varName === 'jackpotPct') return parseFloat(pv.jackpotPct) || 0;
        if (varName === 'jackpotVolume') return ibEffectiveVolume() * (parseFloat(pv.jackpotPct) || 0) / 100;
        // Fluid / containerized volume (from Export To Plan; scales in scaling mode)
        if (varName === 'fluidVolume') return ibFcVolume('fluidVolume');
        if (varName === 'containerizedVolume') return ibFcVolume('containerizedVolume');
        // Crossdock containers (manual Plan input)
        if (varName === 'crossdockContainers') return parseFloat(pv.crossdockContainers) || 0;
        // Total packages per size (xs, s, m, l, xl, nc, ncp)
        for (var si = 0; si < FORMULA_SIZE_VARS.length; si++) {
            if (FORMULA_SIZE_VARS[si].v === varName) return ibSizeTotal(FORMULA_SIZE_VARS[si].bd);
        }
        if (engineSettings.mheTypes) {
            var vm = engineSettings.volumeMix || {};
            for (var i = 0; i < engineSettings.mheTypes.length; i++) {
                var mhe = engineSettings.mheTypes[i];
                var mheSlug = mhe.replace(/\s+/g, '-');
                // Per-MHE total volume goal: MHE-total = MHE volume
                if (mheSlug + '-total' === varName) {
                    return ibMheVolume(mhe);
                }
                // Per-MHE user-defined Sort Length
                if (mheSlug + '-Sort-Length' === varName) {
                    return parseFloat((engineSettings.mheSortLength || {})[mhe]) || 0;
                }
                // Per-MHE size volume: MHE-xs = sizeTotal x volumeMix[MHE|size] %
                for (var k = 0; k < FORMULA_SIZE_VARS.length; k++) {
                    var sv = FORMULA_SIZE_VARS[k];
                    if (mheSlug + '-' + sv.v === varName) {
                        var mixPct = parseFloat(vm[mhe + '|' + sv.mix]) || 0;
                        return ibSizeTotal(sv.bd) * mixPct / 100;
                    }
                }
                // Per-MHE attribute value
                for (var j = 0; j < FORMULA_MHE_ATTRS.length; j++) {
                    var attr = FORMULA_MHE_ATTRS[j];
                    var slug = mheSlug + '-' + attr.replace(/[\s%]+/g, '-').replace(/-+$/, '');
                    if (slug === varName) {
                        var raw = (engineSettings.mheAttrs && engineSettings.mheAttrs[mhe + '|' + attr]) || '0';
                        var num = parseFloat(raw) || 0;
                        if (attr.indexOf('%') !== -1) return num / 100; // percent stored as whole number
                        return num;
                    }
                }
            }
        }
        return 0;
    }

    // Excel-style functions available inside formulas.
    var FORMULA_FUNCS = {
        IF: function(c, a, b) { return c ? a : b; },
        MIN: function() { return Math.min.apply(null, arguments); },
        MAX: function() { return Math.max.apply(null, arguments); },
        ROUND: function(n, d) { var f = Math.pow(10, d || 0); return Math.round(n * f) / f; },
        ROUNDUP: function(n, d) { var f = Math.pow(10, d || 0); return Math.ceil(n * f) / f; },
        ROUNDDOWN: function(n, d) { var f = Math.pow(10, d || 0); return Math.floor(n * f) / f; },
        CEILING: function(n) { return Math.ceil(n); },
        FLOOR: function(n) { return Math.floor(n); },
        ABS: function(n) { return Math.abs(n); },
        AND: function() { return Array.prototype.every.call(arguments, Boolean); },
        OR: function() { return Array.prototype.some.call(arguments, Boolean); },
        NOT: function(a) { return !a; },
        SUM: function() { var s = 0; for (var i = 0; i < arguments.length; i++) s += (parseFloat(arguments[i]) || 0); return s; },
        MROUND: function(n, m) { return m ? Math.round(n / m) * m : n; }
    };
    var FORMULA_FUNC_NAMES = Object.keys(FORMULA_FUNCS);

    // Evaluate an already-substituted expression string with the Excel-style
    // helper functions injected into scope. Shared by evaluation and validation.
    function runFormulaExpr(expr) {
        var fn = Function.apply(null, FORMULA_FUNC_NAMES.concat(['"use strict"; return (' + expr + ')']));
        return fn.apply(null, FORMULA_FUNC_NAMES.map(function(k) { return FORMULA_FUNCS[k]; }));
    }

    // Evaluate a role's formula string, substituting variables with live values.
    // engRate resolves to the role's own Eng Rate. Returns NaN if evaluation fails.
    function evaluateRoleFormula(formula, role) {
        if (!formula) return 0;
        var allVars = getFormulaVariables();
        // Sort variable names longest-first so prefixes don't clobber longer matches
        var sorted = allVars.slice().sort(function(a, b) { return b.length - a.length; });
        var expr = formula;
        sorted.forEach(function(v) {
            var val;
            if (v === 'engRate') {
                val = parseFloat(role && role.rate) || 0;
            } else if (v === 'Variable') {
                // The role's own Variable column (blank => 1x).
                val = (role && role.variable !== undefined && role.variable !== '') ? (parseFloat(role.variable) || 0) : 1;
            } else {
                val = resolveFormulaVarValue(v);
            }
            expr = expr.replace(new RegExp(v.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), '(' + val + ')');
        });
        try {
            var result = runFormulaExpr(expr);
            return (typeof result === 'number' && !isNaN(result)) ? result : NaN;
        } catch (e) {
            return NaN;
        }
    }

    // Bottoms Up HC = sum of Planned HC across every role (same per-role math
    // as the Plan table: hourly / plan rate).
    function computeBupHC() {
        var totalHC = 0;
        (engineSettings.groups || []).forEach(function(g) {
            var opLen = ibOpLengthFor(resolveGroupMhe(g));
            (g.roles || []).forEach(function(r) {
                if (typeof r !== 'object') return;
                var engRate = parseFloat(r.rate) || 0;
                var planRate = (r.planRate !== undefined && r.planRate !== '') ? parseFloat(r.planRate) : engRate;
                if (isNaN(planRate)) planRate = engRate;
                var variable = (r.variable !== undefined && r.variable !== '') ? parseFloat(r.variable) : 1;
                if (isNaN(variable)) variable = 1;
                var rawTotal = evaluateRoleFormula(r.formula, r);
                var total = isNaN(rawTotal) ? 0 : rawTotal;
                var hourly = (opLen > 0) ? total / opLen : 0;
                var plannedHC = (planRate > 0) ? hourly / planRate : 0;
                if (!isNaN(plannedHC)) totalHC += plannedHC;
            });
        });
        return totalHC;
    }

    // Bottoms Up TPH = total volume / sort length / total BUP HC.
    function computeBupTPH() {
        var sortLen = parseFloat((engineSettings.planVars || {}).sortLength) || 0;
        var hc = computeBupHC();
        if (sortLen <= 0 || hc <= 0) return 0;
        return ibEffectiveVolume() / sortLen / hc;
    }

    // Expected Attendance = SSPOT HC x Attendance Assumption.
    function ibExpectedAttendance() {
        var pv = engineSettings.planVars || {};
        var sspot = parseFloat(pv.sspotHC) || 0;
        var att = parseFloat(pv.attendanceAssumption) || 0;
        var frac = att > 1 ? att / 100 : att;
        return sspot * frac;
    }

    // VTO / VET = Bottoms Up HC - Expected Attendance
    // (positive => surplus/VTO, negative => shortfall/VET).
    function ibVtoVet() {
        return computeBupHC() - ibExpectedAttendance();
    }

    function renderPlanTab() {
        renderPlanVarsPanel();
        renderPlanTable();
    }

    // Field definitions for the "Sort Details & KPIs" planning variables panel.
    // All values are hardcoded/manual inputs (no calculated fields).
    // Sort Details & KPIs. Computed fields (operationalLength, sortNonConVolume-
    // Goal in exact, bottomsUpHC, bottomsUpTPH) are rendered read-only.
    var PLAN_KPI_FIELDS = [
        { key: 'sortVolumeGoal', label: 'Sort Volume Goal' },
        { key: 'sortNonConVolumeGoal', label: 'Sort Non-Con Volume Goal' },
        { key: 'sortLength', label: 'Sort Length' },
        { key: 'startUpBreak', label: 'Start Up & Break' },
        { key: 'operationalLength', label: 'Operational Length' },
        { key: 'laborPlanTPH', label: 'Labor Plan TPH' },
        { key: 'laborPlanHC', label: 'Labor Plan HC' },
        { key: 'sspotHC', label: 'SSPOT HC' },
        { key: 'attendanceAssumption', label: 'Sort Attendance Assumption' },
        { key: 'expectedAttendance', label: 'Expected Attendance' },
        { key: 'bottomsUpHC', label: 'Bottoms Up HC' },
        { key: 'bottomsUpTPH', label: 'Bottoms Up TPH' },
        { key: 'vtoVet', label: 'VTO / VET' }
    ];
    var PLAN_MISC_FIELDS = [
        { key: 'fluidVolume', label: 'Fluid Volume' },
        { key: 'containerizedVolume', label: 'Containerized Volume' },
        { key: 'crossdockContainers', label: 'Crossdock Containers' },
        { key: 'problemSolvePct', label: 'Problem Solve %' },
        { key: 'problemSolve', label: 'Problem Solve' },
        { key: 'jackpotPct', label: 'Jackpot %' },
        { key: 'jackpotVolume', label: 'Jackpot Volume' },
        { key: 'nonConPct', label: 'Non-Con %' },
        { key: 'nonConPlusPct', label: 'Non-Con Plus %' }
    ];
    var PLAN_ALPS_FIELDS = [
        { key: 'alpsAttendancePct', label: 'Attendance %' },
        { key: 'alpsTPH', label: 'TPH' },
        { key: 'alpsPlannedHC', label: 'Planned HC' },
        { key: 'alpsForecastVolume', label: 'Forecast volume' }
    ];
    var PLAN_SIZE_KEYS = [
        { key: 'extraSmall', label: 'Extra Small' },
        { key: 'small', label: 'Small' },
        { key: 'medium', label: 'Medium' },
        { key: 'large', label: 'Large' },
        { key: 'extraLarge', label: 'Extra Large' },
        { key: 'nonCon', label: 'Non-Con' },
        { key: 'nonConPlus', label: 'Non-Con +' }
    ];

    function renderPlanVarsPanel() {
        var container = document.getElementById('he-plan-vars-panel');
        if (!container) return;
        if (!engineSettings.planVars) engineSettings.planVars = {};
        if (!engineSettings.packageBreakdown) {
            engineSettings.packageBreakdown = { extraSmall: '29.37', small: '19.73', medium: '17.91', large: '18.09', extraLarge: '8.63', nonCon: '3.45', nonConPlus: '2.83' };
        }
        var pv = engineSettings.planVars;
        var bd = engineSettings.packageBreakdown;
        var sortVolumeGoal = parseFloat(pv.sortVolumeGoal) || 0;

        var gridBorder = '1px solid #3a3f47';
        var td = function(content, opts) {
            opts = opts || {};
            var style = 'padding:4px 8px;border:' + gridBorder + ';font-size:11px;';
            style += 'text-align:' + (opts.align || 'left') + ';';
            style += 'color:' + (opts.color || 'var(--he-text)') + ';';
            style += 'background:' + (opts.bg || 'var(--he-bg)') + ';';
            if (opts.bold) style += 'font-weight:700;';
            var tag = opts.colspan ? ('<td colspan="' + opts.colspan + '" style="' + style + '">') : ('<td style="' + style + '">');
            return tag + content + '</td>';
        };
        var inputCell = function(key, opts) {
            opts = opts || {};
            var val = pv[key] !== undefined ? pv[key] : '';
            return td('<input type="text" class="he-plankpi" data-key="' + key + '" value="' + val + '" style="width:100%;box-sizing:border-box;padding:2px 4px;background:transparent;border:1px solid transparent;color:' + (opts.color || 'var(--he-text)') + ';font-size:11px;text-align:right">', {bg: opts.bg || 'var(--he-bg)', align: 'right'});
        };

        var html = '<table style="width:100%;border-collapse:collapse;font-family:Calibri,Arial,sans-serif;margin-bottom:14px">';
        html += '<tr>' + td('Sort Details & KPIs', {bg: 'var(--he-border)', color: 'var(--he-text)', bold: true, colspan: 2, align: 'center'}) + '</tr>';
        var _kpiRO = function(label, valStr, title) {
            return '<tr>' + td(label, {}) + td('<span style="color:var(--he-muted)"' + (title ? ' title="' + title + '"' : '') + '>' + valStr + '</span>', {align: 'right', bg: 'var(--he-border2)'}) + '</tr>';
        };
        var _fmtN = function(n, dec) { return (isNaN(n) ? 0 : n).toLocaleString(undefined, {minimumFractionDigits: dec||0, maximumFractionDigits: dec||0}); };
        PLAN_KPI_FIELDS.forEach(function(f) {
            if (f.key === 'sortVolumeGoal' && engineSettings.planMode === 'exact') {
                html += _kpiRO(f.label, ibEffectiveVolume().toLocaleString(), 'Exact mode: volume equals the inbound data pull');
            } else if (f.key === 'sortNonConVolumeGoal' && engineSettings.planMode === 'exact') {
                html += _kpiRO(f.label, Math.round(ibSortNonConGoal()).toLocaleString(), 'Exact mode: NC + NC+ from the inbound data pull');
            } else if (f.key === 'operationalLength') {
                html += _kpiRO(f.label, _fmtN(ibOperationalLength(), 2), 'Sort Length - Start Up & Break');
            } else if (f.key === 'bottomsUpHC') {
                html += _kpiRO(f.label, _fmtN(computeBupHC(), 1), 'Sum of Planned HC across all roles');
            } else if (f.key === 'bottomsUpTPH') {
                html += _kpiRO(f.label, _fmtN(computeBupTPH(), 1), 'Total volume / Sort Length / Bottoms Up HC');
            } else if (f.key === 'expectedAttendance') {
                html += _kpiRO(f.label, _fmtN(ibExpectedAttendance(), 0), 'SSPOT HC x Attendance Assumption');
            } else if (f.key === 'vtoVet') {
                html += _kpiRO(f.label, _fmtN(ibVtoVet(), 0), 'Bottoms Up HC - Expected Attendance');
            } else {
                html += '<tr>' + td(f.label, {}) + inputCell(f.key) + '</tr>';
            }
        });
        html += '</table>';

        // Per-MHE Sort Length (user-defined; exposed as {MHE}-Sort-Length var).
        if (!engineSettings.mheSortLength) engineSettings.mheSortLength = {};
        if ((engineSettings.mheTypes || []).length) {
            html += '<table style="width:100%;border-collapse:collapse;font-family:Calibri,Arial,sans-serif;margin-bottom:14px">';
            html += '<tr>' + td('MHE Sort Length', {bg: 'var(--he-border)', color: 'var(--he-text)', bold: true, colspan: 2, align: 'center'}) + '</tr>';
            engineSettings.mheTypes.forEach(function(mhe) {
                var v = engineSettings.mheSortLength[mhe] !== undefined ? engineSettings.mheSortLength[mhe] : '';
                html += '<tr>' + td(mhe, {}) +
                    td('<input type="text" class="he-mhe-sortlen" data-mhe="' + mhe + '" value="' + v + '" style="width:100%;box-sizing:border-box;padding:2px 4px;background:transparent;border:1px solid transparent;color:var(--he-text);font-size:11px;text-align:right">', {align: 'right'}) + '</tr>';
            });
            html += '</table>';
        }

        // matches the active plan mode (simple: goal x mix%, scaling: goal x
        // data mix%, exact: exact IB counts). Percent = size / total.
        var _sizePkgs = {};
        var totalPackages = 0;
        PLAN_SIZE_KEYS.forEach(function(s) {
            var p = Math.round(ibSizeTotal(s.key));
            _sizePkgs[s.key] = p;
            totalPackages += p;
        });
        html += '<table style="width:100%;border-collapse:collapse;font-family:Calibri,Arial,sans-serif;margin-bottom:14px">';
        html += '<tr>' + td('Volume Mix', {bg: 'var(--he-border)', color: 'var(--he-text)', bold: true}) + td('Packages', {bg: 'var(--he-border)', color: 'var(--he-text)', bold: true, align: 'right'}) + td('Percents', {bg: 'var(--he-border)', color: 'var(--he-text)', bold: true, align: 'right'}) + '</tr>';
        var totalPct = 0;
        PLAN_SIZE_KEYS.forEach(function(s) {
            var packages = _sizePkgs[s.key];
            var pct = totalPackages > 0 ? (packages / totalPackages) * 100 : 0;
            totalPct += pct;
            html += '<tr>';
            html += td(s.label, {});
            html += td(packages.toLocaleString(), {align: 'right', bg: 'var(--he-border2)', color: 'var(--he-text)'});
            html += td(pct.toFixed(2) + '%', {align: 'right', bg: 'var(--he-border2)', color: 'var(--he-text)'});
            html += '</tr>';
        });
        html += '<tr>' + td('Total', {bold: true, extra: ''}) + td(totalPackages.toLocaleString(), {align: 'right', bold: true}) + td(totalPct.toFixed(2) + '%', {align: 'right', bold: true}) + '</tr>';
        html += '</table>';

        // Volume Targets: Total Sort + one row per MHE type, with Hourly/15min/5min derived.
        // Hourly = Total / Operational Length (per-MHE when the MHE has its own
        // Sort Length); 15 Min = Hourly/4; 5 Min = Hourly/12.
        var vmix = engineSettings.volumeMix || {};
        var fmtT = function(n) { return Math.round(n).toLocaleString(); };
        function targetsRow(label, totalGoal, bold, mheForLen) {
            var opLen = ibOpLengthFor(mheForLen || null);
            var hourly = opLen > 0 ? totalGoal / opLen : 0;
            return '<tr>' + td(label, {bold: !!bold}) +
                td(fmtT(totalGoal), {align:'right', bg:'var(--he-border2)', bold: !!bold}) +
                td(fmtT(hourly), {align:'right', bg:'var(--he-border2)'}) +
                td(fmtT(hourly / 4), {align:'right', bg:'var(--he-border2)'}) +
                td(fmtT(hourly / 12), {align:'right', bg:'var(--he-border2)'}) + '</tr>';
        }
        html += '<table style="width:100%;border-collapse:collapse;font-family:Calibri,Arial,sans-serif;margin-bottom:14px">';
        html += '<tr>' + td('Volume Targets', {bg:'var(--he-border)', color:'var(--he-text)', bold:true}) +
            td('Total Goal', {bg:'var(--he-border)', color:'var(--he-text)', bold:true, align:'right'}) +
            td('Hourly Goal', {bg:'var(--he-border)', color:'var(--he-text)', bold:true, align:'right'}) +
            td('15 Min Goal', {bg:'var(--he-border)', color:'var(--he-text)', bold:true, align:'right'}) +
            td('5 Min Goal', {bg:'var(--he-border)', color:'var(--he-text)', bold:true, align:'right'}) + '</tr>';
        html += targetsRow('Total Sort', ibEffectiveVolume(), true);
        (engineSettings.mheTypes || []).forEach(function(mhe) {
            html += targetsRow(mhe, ibMheVolume(mhe), false, mhe);
        });
        html += '</table>';

        // Misc inputs (Problem Solve / Jackpot / Non-Con)
        html += '<table style="width:100%;border-collapse:collapse;font-family:Calibri,Arial,sans-serif;margin-bottom:14px">';
        PLAN_MISC_FIELDS.forEach(function(f) {
            if ((f.key === 'fluidVolume' || f.key === 'containerizedVolume') && engineSettings.planMode === 'scaling') {
                html += _kpiRO(f.label, Math.round(ibFcVolume(f.key)).toLocaleString(), 'Exported count scaled to Sort Volume Goal');
            } else if ((f.key === 'fluidVolume' || f.key === 'containerizedVolume') && (engineSettings.planMode || 'simple') === 'simple') {
                html += _kpiRO(f.label, Math.round(ibFcVolume(f.key)).toLocaleString(), 'Sort Volume Goal x Settings Fluid/Containerized %');
            } else if (f.key === 'problemSolve') {
                var psPct = parseFloat(pv.problemSolvePct) || 0;
                html += _kpiRO(f.label, Math.round(ibEffectiveVolume() * psPct / 100).toLocaleString(), 'Total volume x Problem Solve %');
            } else if (f.key === 'jackpotVolume') {
                var jpPct = parseFloat(pv.jackpotPct) || 0;
                html += _kpiRO(f.label, Math.round(ibEffectiveVolume() * jpPct / 100).toLocaleString(), 'Total volume x Jackpot %');
            } else {
                html += '<tr>' + td(f.label, {}) + inputCell(f.key) + '</tr>';
            }
        });
        html += '</table>';

        // ALPS Plan
        html += '<table style="width:100%;border-collapse:collapse;font-family:Calibri,Arial,sans-serif">';
        html += '<tr>' + td('ALPS Plan', {bg: 'var(--he-border)', color: 'var(--he-text)', bold: true, colspan: 2, align: 'center'}) + '</tr>';
        PLAN_ALPS_FIELDS.forEach(function(f) {
            html += '<tr>' + td(f.label, {}) + inputCell(f.key) + '</tr>';
        });
        html += '</table>';

        container.innerHTML = html;

        // Wire up KPI inputs
        container.querySelectorAll('.he-plankpi').forEach(function(inp) {
            inp.addEventListener('change', function() {
                var key = inp.getAttribute('data-key');
                engineSettings.planVars[key] = inp.value.trim();
                // Changing the plan Sort Length cascades to every MHE's sort length
                if (key === 'sortLength') {
                    if (!engineSettings.mheSortLength) engineSettings.mheSortLength = {};
                    (engineSettings.mheTypes || []).forEach(function(mhe) {
                        engineSettings.mheSortLength[mhe] = inp.value.trim();
                    });
                }
                saveSettings();
                renderPlanTable();
                // Re-render the panel so computed fields (Operational Length,
                // Bottoms Up HC/TPH, Volume Mix, Volume Targets) update.
                renderPlanVarsPanel();
            });
        });

        // Wire up per-MHE Sort Length inputs
        container.querySelectorAll('.he-mhe-sortlen').forEach(function(inp) {
            inp.addEventListener('change', function() {
                if (!engineSettings.mheSortLength) engineSettings.mheSortLength = {};
                engineSettings.mheSortLength[inp.getAttribute('data-mhe')] = inp.value.trim();
                saveSettings();
                renderPlanTable();
            });
        });
    }

    // Return readable text color (dark or white) for a given background hex,
    // so user-picked group colors (e.g. yellow) stay legible.
    function heContrastText(hex) {
        if (!hex || hex.charAt(0) !== '#') return '#fff';
        var h = hex.slice(1);
        if (h.length === 3) h = h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
        if (h.length < 6) return '#fff';
        var r = parseInt(h.substr(0,2),16), g = parseInt(h.substr(2,2),16), b = parseInt(h.substr(4,2),16);
        var lum = 0.299*r + 0.587*g + 0.114*b;
        return lum > 150 ? '#111' : '#fff';
    }

    function renderPlanTable() {
        var container = document.getElementById('he-plan-table');
        if (!container) return;
        if (!engineSettings.groups || engineSettings.groups.length === 0) {
            container.innerHTML = '<div style="color:#555;text-align:center;padding:40px;font-size:12px">No groups/roles defined yet. Add them in the Build tab.</div>';
            return;
        }
        var pv = engineSettings.planVars || {};
        var attendance = parseFloat(pv.attendanceAssumption) || 0;
        var attendanceFrac = attendance > 1 ? attendance / 100 : attendance;

        // Excel-like grid styling (dark theme)
        var gridBorder = '1px solid #3a3f47';
        var cellPad = '4px 8px';
        var bgDark = 'var(--he-bg)';
        var bgGray = '#c9cdd3';
        var textLight = 'var(--he-text)';
        var textMuted = 'var(--he-muted)';
        var textDarkOnLight = '#1a1a1a';
        var orangeBg = '#f4b183';
        var blueBg = '#9dc3e6';

        var td = function(content, opts) {
            opts = opts || {};
            var style = 'padding:' + cellPad + ';border:' + gridBorder + ';font-size:11px;';
            style += 'text-align:' + (opts.align || 'center') + ';';
            style += 'color:' + (opts.color || textLight) + ';';
            style += 'background:' + (opts.bg || bgDark) + ';';
            if (opts.bold) style += 'font-weight:700;';
            if (opts.extra) style += opts.extra;
            var tag = opts.colspan ? ('<td colspan="' + opts.colspan + '" style="' + style + '">') : ('<td style="' + style + '">');
            return tag + content + '</td>';
        };

        var html = '<table style="width:100%;border-collapse:collapse;font-family:Calibri,Arial,sans-serif">';

        // Super-header row (Volume / Rate / Planned / SARG) - shown once at the very top
        html += '<tr>';
        html += td('Bottoms Up Planner - Grouped by Area', {bg: 'var(--he-border)', color: textLight, bold: true, align: 'left', colspan: 2, extra: 'text-decoration:underline;'});
        html += td('Volume', {bg: 'var(--he-border)', color: textLight, bold: true, colspan: 2, extra: 'text-decoration:underline;'});
        html += td('Rate', {bg: 'var(--he-border)', color: textLight, bold: true, colspan: 3, extra: 'text-decoration:underline;'});
        html += td('Planned', {bg: 'var(--he-border)', color: textLight, bold: true, colspan: 2, extra: 'text-decoration:underline;'});
        html += td('SARG', {bg: 'var(--he-border)', color: textLight, bold: true, extra: 'text-decoration:underline;'});
        html += '</tr>';

        engineSettings.groups.forEach(function(g, gi) {
            var color = g.color || 'var(--he-border)';
            var hdrFg = heContrastText(g.color || '');
            var gOpLength = ibOpLengthFor(resolveGroupMhe(g));
            // Group name banner (colored, over the Process Path column only;
            // rest of the row left blank), then the column-label row.
            html += '<tr>' + td(g.name || 'Unnamed Group', {bg: color, color: hdrFg, bold: true, align: 'left'}) + td('', {colspan: 9}) + '</tr>';
            html += '<tr>';
            html += td('Process Path', {bg: color, color: hdrFg, bold: true, align: 'left'});
            html += td('Variable', {bg: color, color: hdrFg, bold: true});
            html += td('Total', {bg: color, color: hdrFg, bold: true});
            html += td('Hourly', {bg: color, color: hdrFg, bold: true});
            html += td('Engineer', {bg: color, color: hdrFg, bold: true});
            html += td('Plan', {bg: color, color: hdrFg, bold: true});
            html += td('Delta', {bg: color, color: hdrFg, bold: true});
            html += td('HC', {bg: color, color: hdrFg, bold: true});
            html += td('Hrs', {bg: color, color: hdrFg, bold: true});
            html += td('HC', {bg: color, color: hdrFg, bold: true});
            html += '</tr>';

            if (!g.roles || g.roles.length === 0) return;
            g.roles.forEach(function(r, ri) {
                if (typeof r !== 'object') return;
                var name = r.name || '(unnamed role)';
                var engRate = parseFloat(r.rate) || 0;
                var planRate = (r.planRate !== undefined && r.planRate !== '') ? parseFloat(r.planRate) : engRate;
                if (isNaN(planRate)) planRate = engRate;
                var variable = (r.variable !== undefined && r.variable !== '') ? parseFloat(r.variable) : 1;
                if (isNaN(variable)) variable = 1;
                var hasVariable = (r.variable !== undefined && r.variable !== '');

                var rawTotal = evaluateRoleFormula(r.formula, r);
                var total = isNaN(rawTotal) ? NaN : rawTotal;
                var totalValid = !isNaN(total);
                var hourly = (totalValid && gOpLength > 0) ? (total / gOpLength) : NaN;
                var delta = (engRate > 0) ? (planRate / engRate - 1) : NaN;
                var plannedHC = (!isNaN(hourly) && planRate > 0) ? (hourly / planRate) : NaN;
                var plannedHrs = (!isNaN(plannedHC)) ? (plannedHC * gOpLength) : NaN;
                var sargHC = (!isNaN(plannedHC) && attendanceFrac > 0) ? Math.ceil(plannedHC / attendanceFrac) : NaN;

                // Conditional formatting on Delta: red < 0, green > 0, gray at 0/blank
                var deltaBg = isNaN(delta) ? bgGray : (delta < -0.001 ? '#f8cbad' : (delta > 0.001 ? '#c6e0b4' : bgGray));
                var deltaFg = textDarkOnLight;
                var fmt = function(n, decimals) {
                    if (n === undefined || n === null || isNaN(n)) return '—';
                    return n.toLocaleString(undefined, { minimumFractionDigits: decimals || 0, maximumFractionDigits: decimals || 0 });
                };
                var fmtPct = function(n) { return isNaN(n) ? '—' : (n >= 0 ? '+' : '') + (n * 100).toFixed(1) + '%'; };

                html += '<tr class="he-plan-row">';
                html += td(name, {color: textLight, align: 'left'});
                html += td('<input type="text" class="he-plan-variable" data-gi="' + gi + '" data-ri="' + ri + '" value="' + (r.variable || '') + '" placeholder="" style="width:50px;padding:2px 4px;background:transparent;border:1px solid transparent;color:' + textDarkOnLight + ';font-size:11px;text-align:center">', {bg: hasVariable ? orangeBg : bgDark});
                html += td(fmt(total), {bg: bgGray, color: textDarkOnLight});
                html += td(fmt(hourly), {bg: bgGray, color: textDarkOnLight});
                html += td(fmt(engRate), {bg: blueBg, color: textDarkOnLight});
                html += td('<input type="text" class="he-plan-rate" data-gi="' + gi + '" data-ri="' + ri + '" value="' + planRate + '" style="width:56px;padding:2px 4px;background:transparent;border:1px solid transparent;color:' + textDarkOnLight + ';font-size:11px;text-align:center">', {bg: bgGray});
                html += td(fmtPct(delta), {bg: deltaBg, color: deltaFg, bold: true});
                html += td(fmt(plannedHC, 0), {color: textLight});
                html += td(fmt(plannedHrs, 0), {color: textLight});
                html += td(fmt(sargHC), {color: textLight});
                html += '</tr>';
            });
        });
        html += '</table>';
        container.innerHTML = html;

        // Wire up Plan rate / Variable inputs
        container.querySelectorAll('.he-plan-rate').forEach(function(inp) {
            inp.addEventListener('change', function() {
                var gi = parseInt(inp.getAttribute('data-gi'));
                var ri = parseInt(inp.getAttribute('data-ri'));
                var val = inp.value.trim();
                if (engineSettings.groups[gi] && engineSettings.groups[gi].roles[ri]) {
                    engineSettings.groups[gi].roles[ri].planRate = val;
                    saveSettings();
                    renderPlanTable();
                }
            });
        });
        container.querySelectorAll('.he-plan-variable').forEach(function(inp) {
            inp.addEventListener('change', function() {
                var gi = parseInt(inp.getAttribute('data-gi'));
                var ri = parseInt(inp.getAttribute('data-ri'));
                var val = inp.value.trim();
                if (engineSettings.groups[gi] && engineSettings.groups[gi].roles[ri]) {
                    engineSettings.groups[gi].roles[ri].variable = val;
                    saveSettings();
                    renderPlanTable();
                }
            });
        });

        wirePlanCellSelection(container);
    }

    // Excel-style rectangular cell selection for the Bottoms Up Planner table.
    // Click = single cell, Shift+click = extend range, drag = rectangle,
    // Ctrl/Cmd+click = toggle extra cells. Shows Sum/Count/Avg of the numeric
    // cells in the selection via a floating status bar.
    function wirePlanCellSelection(container) {
        var stale = document.getElementById('he-plan-selbar');
        if (stale) stale.remove();
        var rows = container.querySelectorAll('tr.he-plan-row');
        if (!rows.length) return;
        var grid = []; // grid[r][c] = td
        rows.forEach(function(tr, r) {
            tr.setAttribute('data-dr', r);
            var rowCells = [];
            Array.prototype.forEach.call(tr.children, function(cell, c) {
                cell.setAttribute('data-dc', c);
                cell.classList.add('he-pcell');
                cell.style.userSelect = 'none';
                rowCells.push(cell);
            });
            grid.push(rowCells);
        });

        var anchor = null, focus = null, dragging = false;
        var extra = []; // additional {r,c} from ctrl-click

        function cellNumber(cell) {
            if (!cell) return null;
            var inp = cell.querySelector('input');
            var raw = inp ? inp.value : cell.textContent;
            if (raw == null) return null;
            raw = ('' + raw).replace(/[,%\s]/g, '').replace(/[^0-9.\-]/g, '');
            if (raw === '' || raw === '-' || raw === '.') return null;
            var n = parseFloat(raw);
            return isNaN(n) ? null : n;
        }

        function selectedCells() {
            var out = [];
            if (anchor && focus) {
                var r0 = Math.min(anchor.r, focus.r), r1 = Math.max(anchor.r, focus.r);
                var c0 = Math.min(anchor.c, focus.c), c1 = Math.max(anchor.c, focus.c);
                for (var r = r0; r <= r1; r++) for (var c = c0; c <= c1; c++) if (grid[r] && grid[r][c]) out.push(grid[r][c]);
            }
            extra.forEach(function(e) { if (grid[e.r] && grid[e.r][e.c]) out.push(grid[e.r][e.c]); });
            return out;
        }

        var dark = GM_getValue('he-theme', 'light') === 'dark';
        var selBg = dark ? 'rgba(56,132,255,0.30)' : 'rgba(31,111,235,0.18)';
        var selOutline = dark ? '#4f8cff' : '#1f6feb';

        function paint() {
            container.querySelectorAll('.he-pcell.he-sel').forEach(function(c) {
                c.classList.remove('he-sel'); c.style.boxShadow = ''; c.style.background = c.getAttribute('data-obg') || '';
            });
            var cells = selectedCells();
            cells.forEach(function(c) {
                if (c.getAttribute('data-obg') === null) c.setAttribute('data-obg', c.style.background || '');
                c.classList.add('he-sel');
                c.style.background = selBg;
                c.style.boxShadow = 'inset 0 0 0 1px ' + selOutline;
            });
            updateBar(cells);
        }

        function updateBar(cells) {
            var bar = document.getElementById('he-plan-selbar');
            var nums = cells.map(cellNumber).filter(function(n) { return n !== null; });
            if (!cells.length) { if (bar) bar.remove(); return; }
            var sum = nums.reduce(function(a, b) { return a + b; }, 0);
            var avg = nums.length ? sum / nums.length : 0;
            var fmt = function(n) { return n.toLocaleString(undefined, { maximumFractionDigits: 2 }); };
            if (!bar) {
                bar = document.createElement('div');
                bar.id = 'he-plan-selbar';
                bar.style.cssText = 'position:fixed;bottom:16px;left:50%;transform:translateX(-50%);z-index:100000;background:var(--he-panel);border:1px solid var(--he-border);border-radius:8px;padding:8px 16px;font-family:Calibri,Arial,sans-serif;font-size:12px;color:var(--he-text);box-shadow:0 4px 16px rgba(0,0,0,0.35);display:flex;gap:18px;align-items:center';
                document.body.appendChild(bar);
            }
            bar.innerHTML =
                '<span><b style="color:var(--he-muted)">Sum</b> ' + fmt(sum) + '</span>' +
                '<span><b style="color:var(--he-muted)">Count</b> ' + nums.length + '</span>' +
                '<span><b style="color:var(--he-muted)">Avg</b> ' + fmt(avg) + '</span>' +
                '<span><b style="color:var(--he-muted)">Cells</b> ' + cells.length + '</span>' +
                '<span id="he-plan-selclear" style="cursor:pointer;color:var(--he-muted);font-weight:700">\u2715</span>';
            var clr = document.getElementById('he-plan-selclear');
            if (clr) clr.addEventListener('click', clearSel);
        }

        function clearSel() { anchor = focus = null; extra = []; paint(); }

        function coord(cell) { return { r: parseInt(cell.getAttribute('data-dr') || cell.parentNode.getAttribute('data-dr'), 10), c: parseInt(cell.getAttribute('data-dc'), 10) }; }

        container.addEventListener('mousedown', function(e) {
            var cell = e.target.closest ? e.target.closest('.he-pcell') : null;
            if (!cell || !container.contains(cell)) return;
            // Let inputs (Variable / Plan) still be editable
            if (e.target.tagName === 'INPUT') return;
            var co = { r: parseInt(cell.parentNode.getAttribute('data-dr'), 10), c: parseInt(cell.getAttribute('data-dc'), 10) };
            if (e.shiftKey && anchor) { focus = co; }
            else if (e.ctrlKey || e.metaKey) { extra.push(co); anchor = anchor || co; focus = focus || co; }
            else { anchor = co; focus = co; extra = []; }
            dragging = true;
            e.preventDefault();
            paint();
        });
        container.addEventListener('mouseover', function(e) {
            if (!dragging) return;
            var cell = e.target.closest ? e.target.closest('.he-pcell') : null;
            if (!cell || !container.contains(cell)) return;
            focus = { r: parseInt(cell.parentNode.getAttribute('data-dr'), 10), c: parseInt(cell.getAttribute('data-dc'), 10) };
            paint();
        });
        document.addEventListener('mouseup', function() { dragging = false; });
    }
    // ===== Execute tab =====
    // Runtime cache of RightStation-pulled actuals, keyed by group||role.
    // (Live pull wired later; empty until then so everything is manual.)
    var execPulled = {};

    function execRoleKey(g, r) { return (g.name || '') + '||' + (r.name || ''); }

    // Planned HC for a role — mirrors the Bottoms Up Planner math.
    function execRolePlannedHC(g, r) {
        var opLen = ibOpLengthFor(resolveGroupMhe(g));
        var engRate = parseFloat(r.rate) || 0;
        var planRate = (r.planRate !== undefined && r.planRate !== '') ? parseFloat(r.planRate) : engRate;
        if (isNaN(planRate)) planRate = engRate;
        var rawTotal = evaluateRoleFormula(r.formula, r);
        var total = isNaN(rawTotal) ? 0 : rawTotal;
        var hourly = (opLen > 0) ? total / opLen : 0;
        return { plannedHC: (planRate > 0) ? hourly / planRate : 0, planRate: planRate };
    }

    // Effective actual HC/rate for a role: manual override > RightStation pull >
    // blank (manual entry). Returns the value + a source badge.
    function execActualFor(g, r) {
        var key = execRoleKey(g, r);
        var ov = (engineSettings.execActuals || {})[key] || {};
        var pulled = execPulled[key];
        var hasMap = !!(r.station && r.station.trim());
        var hc, rate, src;
        if (ov.hc !== undefined && ov.hc !== '') { hc = parseFloat(ov.hc); src = hasMap ? 'RS\u270E' : 'manual'; }
        else if (pulled && pulled.hc != null) { hc = pulled.hc; src = 'RS'; }
        else { hc = null; src = hasMap ? 'RS\u2026' : 'manual'; }
        if (ov.rate !== undefined && ov.rate !== '') rate = parseFloat(ov.rate);
        else if (pulled && pulled.rate != null) rate = pulled.rate;
        else rate = null;
        return { hc: (isNaN(hc) ? null : hc), rate: (isNaN(rate) ? null : rate), src: src, key: key, ovHc: (ov.hc || ''), ovRate: (ov.rate || '') };
    }

    // Seam for the live RightStation pull. Stubbed for now.
    function fetchExecActuals() { return Promise.resolve(execPulled); }

    function renderExecuteTab() {
        fetchExecActuals().then(function() { renderExecuteView(); }).catch(function() { renderExecuteView(); });
    }

    function renderExecuteView() {
        var head = document.getElementById('he-exec-header');
        var body = document.getElementById('he-exec-table');
        if (!body) return;
        if (!engineSettings.execActuals) engineSettings.execActuals = {};
        if (!engineSettings.groups || !engineSettings.groups.length) {
            if (head) head.innerHTML = '';
            body.innerHTML = '<div style="color:var(--he-muted);text-align:center;padding:40px;font-size:12px">No groups/roles defined yet. Build them first.</div>';
            return;
        }

        var dark = GM_getValue('he-theme', 'light') === 'dark';
        var bgGray = dark ? '#2a2f37' : '#c9cdd3';
        var blueBg = dark ? '#1d3a5f' : '#bdd7ee';
        var textDark = '#111';
        var gridBorder = '1px solid var(--he-border)';
        var td = function(c, opts) {
            opts = opts || {};
            var s = 'padding:4px 8px;border:' + gridBorder + ';font-size:11px;text-align:' + (opts.align || 'center') + ';';
            s += 'color:' + (opts.color || 'var(--he-text)') + ';background:' + (opts.bg || 'var(--he-bg)') + ';';
            if (opts.bold) s += 'font-weight:700;';
            return '<td' + (opts.colspan ? ' colspan="' + opts.colspan + '"' : '') + ' style="' + s + '">' + c + '</td>';
        };

        var totalPlanned = 0, totalActual = 0;
        execActualMap = {};
        var html = '<table style="width:100%;border-collapse:collapse;font-family:Calibri,Arial,sans-serif">';
        html += '<tr>' +
            td('Process Path', {bg: 'var(--he-border)', bold: true, align: 'left'}) +
            td('Planned HC', {bg: 'var(--he-border)', bold: true}) +
            td('Actual HC', {bg: 'var(--he-border)', bold: true}) +
            td('\u0394', {bg: 'var(--he-border)', bold: true}) +
            td('Plan Rate', {bg: 'var(--he-border)', bold: true}) +
            td('Actual Rate', {bg: 'var(--he-border)', bold: true}) +
            td('Src', {bg: 'var(--he-border)', bold: true}) +
            td('Optimized HC', {bg: 'var(--he-border)', bold: true}) + '</tr>';

        engineSettings.groups.forEach(function(g, gi) {
            var color = g.color || 'var(--he-border)';
            var hdrFg = heContrastText(g.color || '');
            html += '<tr>' + td(g.name || 'Unnamed Group', {bg: color, color: hdrFg, bold: true, align: 'left'}) + td('', {colspan: 7}) + '</tr>';
            (g.roles || []).forEach(function(r, ri) {
                if (typeof r !== 'object') return;
                var p = execRolePlannedHC(g, r);
                var a = execActualFor(g, r);
                var plannedHC = p.plannedHC;
                var actualHC = (a.hc != null) ? a.hc : NaN;
                totalPlanned += isNaN(plannedHC) ? 0 : plannedHC;
                totalActual += isNaN(actualHC) ? 0 : actualHC;
                var delta = (!isNaN(actualHC)) ? (actualHC - plannedHC) : NaN;
                execActualMap[a.key] = (a.hc != null) ? a.hc : null;
                var deltaBg = isNaN(delta) ? bgGray : (delta < -0.5 ? '#f8cbad' : (delta > 0.5 ? '#c6e0b4' : bgGray));
                var fmt = function(n, d) { return (n == null || isNaN(n)) ? '\u2014' : n.toLocaleString(undefined, {minimumFractionDigits: d || 0, maximumFractionDigits: d || 0}); };
                var hcInput = '<input type="text" class="he-exec-hc" data-key="' + a.key + '" value="' + a.ovHc + '" placeholder="' + (a.hc != null && !a.ovHc ? Math.round(a.hc) : '') + '" style="width:52px;padding:2px 4px;background:transparent;border:1px solid transparent;color:' + textDark + ';font-size:11px;text-align:center">';
                var rateInput = '<input type="text" class="he-exec-rate" data-key="' + a.key + '" value="' + a.ovRate + '" placeholder="' + (a.rate != null && !a.ovRate ? Math.round(a.rate) : '') + '" style="width:56px;padding:2px 4px;background:transparent;border:1px solid transparent;color:' + textDark + ';font-size:11px;text-align:center">';
                var srcColor = a.src.indexOf('RS') === 0 ? '#f97316' : 'var(--he-muted)';
                html += '<tr>' +
                    td(r.name || '(unnamed role)', {align: 'left'}) +
                    td(fmt(plannedHC, 1), {bg: bgGray, color: textDark}) +
                    td(hcInput, {bg: bgGray}) +
                    td(fmt(delta, 1), {bg: deltaBg, color: textDark, bold: true}) +
                    td(fmt(p.planRate), {bg: blueBg, color: textDark}) +
                    td(rateInput, {bg: bgGray}) +
                    td('<span style="font-size:9px;color:' + srcColor + '">' + a.src + '</span>', {}) +
                    td('<span style="color:var(--he-muted)" data-opt-key="' + a.key + '">\u2014</span>', {bg: 'var(--he-border2)'}) + '</tr>';
            });
        });
        html += '</table>';
        body.innerHTML = html;

        if (head) {
            var gap = totalActual - totalPlanned;
            var gapColor = gap < -0.5 ? '#d13438' : (gap > 0.5 ? '#1a7f37' : 'var(--he-muted)');
            head.innerHTML =
                '<div style="display:flex;gap:14px;flex-wrap:wrap;align-items:center;margin-bottom:14px">' +
                execStat('Planned HC', Math.round(totalPlanned), 'var(--he-text)') +
                execStat('Actual HC', Math.round(totalActual), 'var(--he-text)') +
                execStat('Gap', (gap >= 0 ? '+' : '') + Math.round(gap), gapColor) +
                '</div>';
        }

        // Wire editable actuals (re-render on blur so totals/deltas update)
        body.querySelectorAll('.he-exec-hc').forEach(function(inp) {
            inp.addEventListener('change', function() {
                var k = inp.getAttribute('data-key');
                if (!engineSettings.execActuals[k]) engineSettings.execActuals[k] = {};
                engineSettings.execActuals[k].hc = inp.value.trim();
                saveSettings();
                renderExecuteView();
            });
        });
        body.querySelectorAll('.he-exec-rate').forEach(function(inp) {
            inp.addEventListener('change', function() {
                var k = inp.getAttribute('data-key');
                if (!engineSettings.execActuals[k]) engineSettings.execActuals[k] = {};
                engineSettings.execActuals[k].rate = inp.value.trim();
                saveSettings();
                renderExecuteView();
            });
        });
    }

    function execStat(label, value, color) {
        return '<div style="background:var(--he-panel);border:1px solid var(--he-border);border-radius:8px;padding:8px 16px;min-width:90px">' +
            '<div style="font-size:10px;color:var(--he-muted);text-transform:uppercase;letter-spacing:0.5px">' + label + '</div>' +
            '<div style="font-size:20px;font-weight:700;color:' + color + '">' + value + '</div></div>';
    }
    // ---- Execute AI optimizer (reuses the DevSpace AI backend) ----
    var execActualMap = {};
    var execAiHistory = [];
    // "Tonight only" ephemeral constraints — session-scoped, never persisted.
    var execSessionNotes = [];

    // ---- Learned-rules memory (with immune system) ----
    // Rule: { id, text, scope ('site' or a role name), source, learnedAt,
    //         bindCount, overrideCount, lastBoundAt, status: 'active' }
    function getLearnedRules() {
        if (!Array.isArray(engineSettings.learnedRules)) engineSettings.learnedRules = [];
        return engineSettings.learnedRules;
    }

    function addLearnedRule(text, scope, source) {
        var rules = getLearnedRules();
        var id = 'lr' + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36);
        rules.push({ id: id, text: text, scope: scope || 'site', source: source || '',
            learnedAt: new Date().toISOString().slice(0, 10),
            bindCount: 0, overrideCount: 0, lastBoundAt: '', status: 'active' });
        saveSettings();
        return id;
    }

    function bumpRuleCounter(ruleId, field) {
        var r = getLearnedRules().find(function(x) { return x.id === ruleId; });
        if (!r) return;
        r[field] = (r[field] || 0) + 1;
        if (field === 'bindCount') r.lastBoundAt = new Date().toISOString().slice(0, 10);
        saveSettings();
    }

    function activeLearnedRules() {
        return getLearnedRules().filter(function(r) { return r.status === 'active'; });
    }

    // Build the ground-truth facts payload the AI optimizes over.
    function execBuildFacts() {
        var paths = [];
        (engineSettings.groups || []).forEach(function(g) {
            var mhe = resolveGroupMhe(g);
            var opLen = ibOpLengthFor(mhe);
            (g.roles || []).forEach(function(r) {
                if (typeof r !== 'object') return;
                var p = execRolePlannedHC(g, r);
                var a = execActualFor(g, r);
                var rate = (a.rate != null) ? a.rate : p.planRate;
                var r1 = function(n) { return (n == null || isNaN(n)) ? null : Math.round(n * 10) / 10; };
                paths.push({
                    id: a.key,
                    group: g.name || '',
                    path: r.name || '',
                    mhe: mhe || '(total sort)',
                    plannedHC: r1(p.plannedHC),
                    planRate: p.planRate || null,
                    hourlyTarget: (p.plannedHC && p.planRate) ? Math.round(p.plannedHC * p.planRate) : null,
                    actualHC: a.hc != null ? a.hc : null,
                    actualRate: a.rate != null ? a.rate : null,
                    capacityPerHr: (a.hc != null && rate) ? Math.round(a.hc * rate) : null,
                    connected: !!r.connected,
                    source: r.source || null,
                    output: r.output || null,
                    rules: (r.aiRules || '').trim()
                });
            });
        });
        var totalActual = paths.reduce(function(s, p) { return s + (p.actualHC || 0); }, 0);
        return {
            site: engineSettings.siteCode || '',
            planMode: engineSettings.planMode || 'simple',
            operationalLength: ibOperationalLength(),
            sortVolumeGoal: ibEffectiveVolume(),
            totalPlannedHC: Math.round(computeBupHC() * 10) / 10,
            totalActualHC: Math.round(totalActual * 10) / 10,
            mheTargets: (engineSettings.mheTypes || []).map(function(m) {
                var ol = ibOpLengthFor(m);
                return { mhe: m, totalVolume: Math.round(ibMheVolume(m)), hourlyGoal: ol > 0 ? Math.round(ibMheVolume(m) / ol) : 0, opLength: ol };
            }),
            // Distilled memory: durable operator rules learned from past
            // interactions (each has an id the AI must cite when applied).
            learnedRules: activeLearnedRules().map(function(r) {
                return { id: r.id, scope: r.scope, text: r.text, learnedAt: r.learnedAt, timesOverridden: r.overrideCount || 0 };
            }),
            // Ephemeral constraints for tonight only (from this session's chat).
            tonightOnly: execSessionNotes.slice(),
            paths: paths
        };
    }

    function execRunOptimizer(userAdjustment) {
        var facts = execBuildFacts();
        if (!facts.paths.length) { execPushMsg('ai', 'Define groups/roles and enter actuals first.'); return; }
        var contract = 'Respond with ONLY a JSON object (no prose, no code fences) in exactly this shape: '
            + '{"allocations":[{"id":"<path id>","recommendedHC":<number>,"reason":"<short>"}],'
            + '"moves":[{"from":"<path name>","to":"<path name>","hc":<number>,"reason":"<short>"}],'
            + '"rulesApplied":[{"ruleId":"<learned rule id, or empty for role rules>","rule":"<which rule>","effect":"<how it changed the allocation>","costHC":<number, HC away from the unconstrained optimum, 0 if free>}],'
            + '"ruleProposals":[{"text":"<durable rule worth remembering>","scope":"<site or exact path name>","source":"<the operator words that imply it>"}],'
            + '"conflicts":[{"ruleId":"<learned rule id>","ruleText":"<the rule>","question":"<what the operator said that contradicts it>"}],'
            + '"risks":["<CPT/throughput risks, VTO/VET notes>"],'
            + '"commentary":"<2-3 sentence plain-English summary>"}';
        var guidance = 'You are the labor optimizer for an Amazon sort center. Use ONLY the numbers in the facts; do not invent figures. '
            + 'Reallocate the AVAILABLE actual HC across paths to best hit each MHE hourly goal and protect the nearest CPT. '
            + 'Keep total recommendedHC approximately equal to totalActualHC (reallocate, do not conjure people); if there is a clear surplus or shortfall, say so under risks as VTO/VET. '
            + 'CONSTRAINTS: honor (a) each path\'s operator-authored "rules" string, (b) every entry in facts.learnedRules (durable operator rules from past sorts), and (c) facts.tonightOnly (tonight-only constraints). '
            + 'For every rule that actually changes your allocation, add a rulesApplied entry citing its ruleId (learned rules) and estimate costHC — how many HC the constraint moves you away from the unconstrained optimum (0 if it costs nothing). Do not hide rule costs. '
            + 'MEMORY: if the operator\'s message states a durable preference (words like always/never/standing/every sort), add it to ruleProposals — do NOT treat tonight-scoped asks (tonight, today, this sort) as durable; put those in your reasoning only. '
            + 'IMMUNE SYSTEM: if the operator\'s message contradicts a learnedRule, do NOT silently pick a side — list it under conflicts and, for this response, follow the operator\'s latest instruction. '
            + 'Every allocation MUST use an "id" from the facts.paths list.';
        var histStr = execAiHistory.slice(-6).map(function(m) { return (m.role === 'user' ? 'Operator: ' : 'AI: ') + m.text; }).join('\n');
        var context = guidance + '\n\n=== FACTS (JSON) ===\n' + JSON.stringify(facts) + (histStr ? ('\n\n=== RECENT ===\n' + histStr) : '') + '\n\n=== OUTPUT FORMAT ===\n' + contract;
        var question = userAdjustment && userAdjustment.trim()
            ? userAdjustment.trim()
            : 'Optimize the current allocation now.';
        if (userAdjustment && userAdjustment.trim()) execPushMsg('user', userAdjustment.trim());
        execPushMsg('typing', 'Optimizing\u2026');
        execAiCall(context, question);
    }

    function execAiCall(context, question) {
        var idx = 0;
        (function attempt() {
            var url = AI_SERVER_URLS[idx];
            if (!url) { execReplaceTyping('All AI servers unavailable. Make sure a DevSpace AI server is running.'); return; }
            GM_xmlhttpRequest({
                method: 'POST', url: url,
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify({ context: context, question: question }),
                timeout: 120000,
                onload: function(resp) {
                    if (resp.status === 401 || resp.status === 403) { idx++; attempt(); return; }
                    var text = '';
                    try { var d = JSON.parse(resp.responseText); text = d.response || d.error || ''; } catch (e) { text = resp.responseText || ''; }
                    var decision = execParseDecision(text);
                    if (decision) { execRenderDecision(decision); }
                    else { execReplaceTyping(text ? text.slice(0, 1200) : 'No response.'); }
                },
                onerror: function() { idx++; attempt(); },
                ontimeout: function() { idx++; attempt(); }
            });
        })();
    }

    function execParseDecision(text) {
        if (!text) return null;
        var s = String(text).replace(/```json/gi, '').replace(/```/g, '').trim();
        var a = s.indexOf('{'), b = s.lastIndexOf('}');
        if (a === -1 || b === -1 || b <= a) return null;
        try {
            var obj = JSON.parse(s.slice(a, b + 1));
            if (!obj || !Array.isArray(obj.allocations)) return null;
            return obj;
        } catch (e) { return null; }
    }

    function execRenderDecision(decision) {
        // Fill the Optimized HC column
        var validIds = {};
        Object.keys(execActualMap).forEach(function(k) { validIds[k] = true; });
        var recSum = 0, hadInvalid = false;
        var body = document.getElementById('he-exec-table');
        (decision.allocations || []).forEach(function(al) {
            if (!al || al.id == null) return;
            if (!validIds[al.id]) { hadInvalid = true; return; }
            var rec = parseFloat(al.recommendedHC);
            if (isNaN(rec)) return;
            recSum += rec;
            if (!body) return;
            var span = body.querySelector('[data-opt-key="' + al.id.replace(/"/g, '\\"') + '"]');
            if (span) {
                var act = execActualMap[al.id];
                var col = (act == null) ? 'var(--he-text)' : (rec > act + 0.5 ? '#1a7f37' : (rec < act - 0.5 ? '#c2410c' : 'var(--he-muted)'));
                span.textContent = Math.round(rec * 10) / 10;
                span.style.color = col;
                span.style.fontWeight = '700';
                if (al.reason) span.parentNode.title = al.reason;
            }
        });
        // Build the AI panel card
        var h = '';
        if (decision.commentary) h += '<div style="margin-bottom:8px;line-height:1.5">' + execEsc(decision.commentary) + '</div>';
        if (Array.isArray(decision.moves) && decision.moves.length) {
            h += '<div style="font-weight:700;margin:8px 0 4px;color:var(--he-text)">Moves</div>';
            decision.moves.forEach(function(m) {
                h += '<div style="padding:4px 6px;border-left:3px solid #1f6feb;background:var(--he-bg);border-radius:4px;margin-bottom:4px">'
                    + '<b>' + execEsc(m.from) + '</b> \u2192 <b>' + execEsc(m.to) + '</b> &nbsp;<span style="color:#1f6feb;font-weight:700">' + execEsc(m.hc) + ' HC</span>'
                    + (m.reason ? '<div style="color:var(--he-muted);font-size:11px">' + execEsc(m.reason) + '</div>' : '') + '</div>';
            });
        }
        if (Array.isArray(decision.rulesApplied) && decision.rulesApplied.length) {
            h += '<div style="font-weight:700;margin:8px 0 4px;color:var(--he-text)">Rules applied</div>';
            decision.rulesApplied.forEach(function(x) {
                // Tolerate both the old string form and the new object form.
                if (typeof x === 'string') { h += '<div style="color:#22a06b;font-size:11px">\u2713 ' + execEsc(x) + '</div>'; return; }
                var cost = parseFloat(x.costHC);
                var costTxt = (!isNaN(cost) && cost > 0)
                    ? ' <span style="color:#d13438;font-weight:700">(costs ~' + (Math.round(cost * 10) / 10) + ' HC vs optimum)</span>'
                    : ' <span style="color:var(--he-muted)">(no cost)</span>';
                h += '<div style="color:#22a06b;font-size:11px">\u2713 ' + execEsc(x.rule || '') + (x.effect ? ' \u2014 ' + execEsc(x.effect) : '') + costTxt + '</div>';
                if (x.ruleId) bumpRuleCounter(x.ruleId, 'bindCount');
            });
        }
        // Immune system: contradictions between what the operator said and memory
        if (Array.isArray(decision.conflicts) && decision.conflicts.length) {
            h += '<div style="font-weight:700;margin:8px 0 4px;color:#d13438">\u26A0 Conflicts with learned rules</div>';
            decision.conflicts.forEach(function(c, ci) {
                var cid = 'he-conf-' + Date.now() + '-' + ci;
                h += '<div id="' + cid + '" style="padding:6px 8px;border:1px solid #d13438;border-radius:6px;margin-bottom:6px;font-size:11px;background:var(--he-bg)">'
                    + '<div style="color:var(--he-text)">Rule: \u201C' + execEsc(c.ruleText || '') + '\u201D</div>'
                    + (c.question ? '<div style="color:var(--he-muted)">You said: ' + execEsc(c.question) + '</div>' : '')
                    + '<div style="margin-top:5px;display:flex;gap:6px">'
                    + '<button class="he-conf-tonight" data-box="' + cid + '" style="padding:3px 8px;background:var(--he-border);border:1px solid var(--he-border2);border-radius:4px;color:var(--he-text);font-size:10px;cursor:pointer">Override tonight only</button>'
                    + '<button class="he-conf-retire" data-box="' + cid + '" data-rule="' + execEsc(c.ruleId || '') + '" style="padding:3px 8px;background:#d13438;border:none;border-radius:4px;color:#fff;font-size:10px;cursor:pointer">Retire the rule</button>'
                    + '</div></div>';
            });
        }
        // Memory: durable rules the AI heard in your words — confirm to save
        if (Array.isArray(decision.ruleProposals) && decision.ruleProposals.length) {
            h += '<div style="font-weight:700;margin:8px 0 4px;color:#1f6feb">\uD83D\uDCA1 Remember this?</div>';
            decision.ruleProposals.forEach(function(p, pi) {
                if (!p || !p.text) return;
                var pid = 'he-prop-' + Date.now() + '-' + pi;
                h += '<div id="' + pid + '" style="padding:6px 8px;border:1px solid #1f6feb;border-radius:6px;margin-bottom:6px;font-size:11px;background:var(--he-bg)">'
                    + '<div style="color:var(--he-text)">\u201C' + execEsc(p.text) + '\u201D <span style="color:var(--he-muted)">(' + execEsc(p.scope || 'site') + ')</span></div>'
                    + (p.source ? '<div style="color:var(--he-muted)">From: ' + execEsc(p.source) + '</div>' : '')
                    + '<div style="margin-top:5px;display:flex;gap:6px">'
                    + '<button class="he-prop-save" data-box="' + pid + '" data-text="' + execEsc(p.text) + '" data-scope="' + execEsc(p.scope || 'site') + '" data-source="' + execEsc(p.source || '') + '" style="padding:3px 8px;background:#1f6feb;border:none;border-radius:4px;color:#fff;font-size:10px;cursor:pointer">Save rule</button>'
                    + '<button class="he-prop-tonight" data-box="' + pid + '" data-text="' + execEsc(p.text) + '" style="padding:3px 8px;background:var(--he-border);border:1px solid var(--he-border2);border-radius:4px;color:var(--he-text);font-size:10px;cursor:pointer">Tonight only</button>'
                    + '<button class="he-prop-dismiss" data-box="' + pid + '" style="padding:3px 8px;background:none;border:1px solid var(--he-border);border-radius:4px;color:var(--he-muted);font-size:10px;cursor:pointer">Dismiss</button>'
                    + '</div></div>';
            });
        }
        if (Array.isArray(decision.risks) && decision.risks.length) {
            h += '<div style="font-weight:700;margin:8px 0 4px;color:var(--he-text)">Risks</div>';
            h += decision.risks.map(function(x) { return '<div style="color:#d13438;font-size:11px">\u26A0 ' + execEsc(x) + '</div>'; }).join('');
        }
        var totalActual = Object.keys(execActualMap).reduce(function(s, k) { return s + (execActualMap[k] || 0); }, 0);
        if (recSum > 0 && Math.abs(recSum - totalActual) > 1) {
            h += '<div style="margin-top:8px;color:#d13438;font-size:11px">\u26A0 Optimizer total ' + Math.round(recSum) + ' HC vs actual ' + Math.round(totalActual) + ' HC (net ' + (recSum > totalActual ? '+' : '') + Math.round(recSum - totalActual) + ').</div>';
        }
        if (hadInvalid) h += '<div style="margin-top:6px;color:#d13438;font-size:11px">\u26A0 Some allocations referenced unknown paths and were ignored.</div>';
        execReplaceTyping(h || 'No structured decision returned.');
        execAiHistory.push({ role: 'ai', text: decision.commentary || 'Optimized.' });
    }

    function execEsc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

    function execPushMsg(kind, text) {
        var box = document.getElementById('he-exec-ai-messages');
        if (!box) return;
        if (kind === 'typing') {
            var t = document.createElement('div');
            t.id = 'he-exec-typing';
            t.style.cssText = 'color:var(--he-muted);font-style:italic;padding:6px 0';
            t.textContent = text;
            box.appendChild(t);
        } else {
            if (kind === 'user') execAiHistory.push({ role: 'user', text: text });
            var d = document.createElement('div');
            d.style.cssText = 'margin:6px 0;padding:6px 8px;border-radius:6px;background:' + (kind === 'user' ? 'var(--he-bg)' : 'var(--he-border2)') + ';color:var(--he-text)';
            d.innerHTML = (kind === 'user' ? '<b>You:</b> ' : '') + execEsc(text);
            box.appendChild(d);
        }
        box.scrollTop = box.scrollHeight;
    }

    function execReplaceTyping(html) {
        var t = document.getElementById('he-exec-typing');
        if (t) t.remove();
        var box = document.getElementById('he-exec-ai-messages');
        if (!box) return;
        var d = document.createElement('div');
        d.style.cssText = 'margin:6px 0;padding:8px 10px;border-radius:8px;background:var(--he-border2);color:var(--he-text);font-size:12px';
        d.innerHTML = html;
        box.appendChild(d);
        box.scrollTop = box.scrollHeight;
        execWireMemoryButtons(box);
    }

    // Delegated handler for Save rule / Tonight only / Dismiss / conflict buttons.
    function execWireMemoryButtons(box) {
        if (box._heMemWired) return;
        box._heMemWired = true;
        box.addEventListener('click', function(e) {
            var btn = e.target.closest ? e.target.closest('button') : null;
            if (!btn) return;
            var boxEl = btn.getAttribute('data-box') ? document.getElementById(btn.getAttribute('data-box')) : null;
            function resolveCard(msg, color) {
                if (boxEl) boxEl.innerHTML = '<div style="color:' + (color || 'var(--he-muted)') + ';font-size:11px">' + msg + '</div>';
            }
            if (btn.classList.contains('he-prop-save')) {
                addLearnedRule(btn.getAttribute('data-text'), btn.getAttribute('data-scope'), btn.getAttribute('data-source'));
                resolveCard('\u2713 Rule saved to memory. It will apply to every future optimization (manage under Settings \u2192 Learned Rules).', '#22a06b');
            } else if (btn.classList.contains('he-prop-tonight')) {
                execSessionNotes.push(btn.getAttribute('data-text'));
                resolveCard('\u2713 Applied for tonight only \u2014 forgotten when you close the panel.', '#1f6feb');
            } else if (btn.classList.contains('he-prop-dismiss')) {
                resolveCard('Dismissed.');
            } else if (btn.classList.contains('he-conf-tonight')) {
                resolveCard('\u2713 Overridden for tonight; the rule stays in memory (override counted).', '#1f6feb');
                // count the override against the rule so repeat overrides surface it
                var rid1 = btn.getAttribute('data-rule');
                if (!rid1) { var sib = btn.parentNode.querySelector('.he-conf-retire'); rid1 = sib && sib.getAttribute('data-rule'); }
                if (rid1) bumpRuleCounter(rid1, 'overrideCount');
            } else if (btn.classList.contains('he-conf-retire')) {
                var rid = btn.getAttribute('data-rule');
                var r = getLearnedRules().find(function(x) { return x.id === rid; });
                if (r) { r.status = 'retired'; saveSettings(); }
                resolveCard('\u2713 Rule retired \u2014 it will no longer constrain the optimizer.', '#d13438');
            }
        });
    }



    function openFormulaModal(gi, ri, role) {
        var existing = document.getElementById('he-formula-modal');

        if (existing) existing.remove();

        var allVars = getFormulaVariables();

        var _fmDark = GM_getValue('he-theme', 'light') === 'dark';
        var pillBg = _fmDark ? '#1c1c3a' : '#ede9fe';
        var pillFg = _fmDark ? '#a78bfa' : '#6d28d9';
        var pillBorder = _fmDark ? '#a78bfa' : '#c4b5fd';
        var inlinePill = 'display:inline-block;padding:1px 6px;margin:0 2px;background:' + pillBg + ';border:1px solid ' + pillBorder + ';border-radius:10px;color:' + pillFg + ';font-size:11px;vertical-align:baseline;user-select:all';

        var pillsHtml = '<div style="margin-bottom:10px;max-height:340px;overflow-y:auto;padding:8px 10px;background:var(--he-bg);border:1px solid var(--he-border);border-radius:6px">';
        getFormulaVariableGroups().forEach(function(grp) {
            if (!grp.vars.length) return;
            pillsHtml += '<div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:var(--he-muted);margin:8px 0 4px;position:sticky;top:0;background:var(--he-bg)">' + grp.label + '</div>';
            pillsHtml += '<div style="display:flex;flex-wrap:wrap;gap:4px">';
            grp.vars.forEach(function(v) {
                pillsHtml += '<span class="he-formula-pill" data-var="' + v + '" style="padding:2px 8px;background:' + pillBg + ';border:1px solid ' + pillBorder + ';border-radius:12px;color:' + pillFg + ';font-size:10px;cursor:pointer;white-space:nowrap">' + v + '</span>';
            });
            pillsHtml += '</div>';
        });
        pillsHtml += '</div>';

        var modal = document.createElement('div');
        modal.id = 'he-formula-modal';
        modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:100001;display:flex;align-items:center;justify-content:center';
        modal.innerHTML =
            '<div style="background:var(--he-panel);border:1px solid var(--he-border);border-radius:10px;padding:20px;min-width:550px;max-width:700px;box-shadow:0 8px 30px rgba(0,0,0,0.8)">' +
                '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">' +
                    '<span style="font-size:14px;font-weight:600;color:var(--he-text)">Formula: ' + (role.name || 'Unnamed Role') + '</span>' +
                    '<button id="he-formula-close" style="background:none;border:none;color:var(--he-muted);font-size:18px;cursor:pointer">✕</button>' +
                '</div>' +
                '<div style="margin-bottom:8px;color:var(--he-muted);font-size:11px">Available variables (click to insert):</div>' +
                pillsHtml +
                '<div style="margin:2px 0 10px;padding:8px 10px;background:var(--he-bg);border:1px solid var(--he-border);border-radius:6px;color:var(--he-muted);font-size:10px;line-height:1.6">' +
                    '<b>Functions:</b> IF(cond, then, else) · MIN · MAX · SUM · ROUND(n,d) · ROUNDUP · ROUNDDOWN · CEILING · FLOOR · ABS · MROUND(n,m) · AND · OR · NOT<br>' +
                    '<b>Operators:</b> <code>+ - * /</code> &nbsp; <code>&gt; &lt; &gt;= &lt;= == !=</code> &nbsp; <code>&amp;&amp; ||</code> &nbsp; and ternary <code>cond ? a : b</code>' +
                '</div>' +
                '<div style="position:relative">' +
                    '<div id="he-formula-input" contenteditable="true" style="width:100%;min-height:100px;padding:10px;background:var(--he-bg);border:1px solid var(--he-border);border-radius:6px;color:var(--he-text);font-family:monospace;font-size:13px;outline:none;white-space:pre-wrap;word-wrap:break-word"></div>' +
                    '<div id="he-formula-autocomplete" style="position:absolute;top:100%;left:0;right:0;background:var(--he-panel);border:1px solid var(--he-border);border-radius:0 0 6px 6px;max-height:120px;overflow-y:auto;display:none;z-index:10"></div>' +
                '</div>' +
                '<div style="display:flex;justify-content:flex-end;gap:8px;margin-top:14px">' +
                    '<button id="he-formula-clear" style="padding:6px 14px;background:none;border:1px solid #da3633;border-radius:6px;color:#da3633;font-size:12px;cursor:pointer;margin-right:auto">Clear</button>' +
                    '<button id="he-formula-cancel" style="padding:6px 14px;background:none;border:1px solid var(--he-border);border-radius:6px;color:var(--he-muted);font-size:12px;cursor:pointer">Cancel</button>' +
                    '<button id="he-formula-save" style="padding:6px 14px;background:#1f6feb;border:none;border-radius:6px;color:#fff;font-size:12px;cursor:pointer">Save</button>' +
                '</div>' +
            '</div>';
        document.body.appendChild(modal);

        var input = document.getElementById('he-formula-input');
        var acBox = document.getElementById('he-formula-autocomplete');

        // Helper: render formula string as HTML with pills
        function formulaToHtml(formula) {
            if (!formula) return '';
            return formula.replace(/([a-zA-Z][\w\-]*)/g, function(word) {
                if (allVars.indexOf(word) !== -1) {
                    return '<span contenteditable="false" style="' + inlinePill + '">' + word + '</span>';
                }
                return word;
            });
        }

        // Helper: extract plain text formula from contenteditable
        function getFormulaText() {
            return input.innerText.trim();
        }

        // Initialize with existing formula
        input.innerHTML = formulaToHtml(role.formula || '');

        // Click pill to insert variable
        document.querySelectorAll('.he-formula-pill').forEach(function(pill) {
            pill.addEventListener('mousedown', function(e) {
                e.preventDefault(); // prevent stealing focus from input
            });
            pill.addEventListener('click', function() {
                var v = pill.getAttribute('data-var');
                var pillHtml = '<span contenteditable="false" style="' + inlinePill + '">' + v + '</span>&nbsp;';
                input.focus();
                // Place cursor at end if no selection
                var sel = window.getSelection();
                if (!sel.rangeCount || !input.contains(sel.anchorNode)) {
                    var range = document.createRange();
                    range.selectNodeContents(input);
                    range.collapse(false);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
                document.execCommand('insertHTML', false, pillHtml);
            });
        });

        // Autocomplete on typing
        input.addEventListener('input', function() {
            var text = getFormulaText();
            var sel = window.getSelection();
            if (!sel.rangeCount) { acBox.style.display = 'none'; return; }
            // Get text before cursor
            var range = sel.getRangeAt(0);
            var preRange = range.cloneRange();
            preRange.selectNodeContents(input);
            preRange.setEnd(range.startContainer, range.startOffset);
            var before = preRange.toString();
            var wordMatch = before.match(/([a-zA-Z][\w\-]*)$/);
            if (!wordMatch || wordMatch[1].length < 2) { acBox.style.display = 'none'; return; }
            var partial = wordMatch[1].toLowerCase();
            var matches = allVars.filter(function(v) { return v.toLowerCase().indexOf(partial) !== -1; });
            if (matches.length === 0 || (matches.length === 1 && matches[0] === wordMatch[1])) { acBox.style.display = 'none'; return; }
            acBox.innerHTML = matches.slice(0, 8).map(function(m) {
                return '<div class="he-ac-item" data-val="' + m + '" style="padding:6px 10px;cursor:pointer;font-size:11px;color:var(--he-text);font-family:monospace;border-bottom:1px solid var(--he-border2)">' + m + '</div>';
            }).join('');
            acBox.style.display = 'block';
            acBox.querySelectorAll('.he-ac-item').forEach(function(item) {
                item.addEventListener('mousedown', function(e) {
                    e.preventDefault();
                    var replacement = item.getAttribute('data-val');
                    // Delete the partial word and insert pill
                    var sel2 = window.getSelection();
                    var r2 = sel2.getRangeAt(0);
                    r2.setStart(r2.startContainer, r2.startOffset - wordMatch[1].length);
                    r2.deleteContents();
                    var pillHtml = '<span contenteditable="false" style="' + inlinePill + '">' + replacement + '</span>&nbsp;';
                    document.execCommand('insertHTML', false, pillHtml);
                    acBox.style.display = 'none';
                    input.focus();
                });
            });
        });
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Tab' && acBox.style.display === 'block') {
                e.preventDefault();
                var first = acBox.querySelector('.he-ac-item');
                if (first) first.dispatchEvent(new MouseEvent('mousedown', {bubbles:true}));
            }
            if (e.key === 'Backspace') {
                var sel = window.getSelection();
                if (sel.rangeCount) {
                    var range = sel.getRangeAt(0);
                    if (range.collapsed && range.startOffset === 0 && range.startContainer === input) return;
                    // Check if previous sibling is a pill span
                    if (range.collapsed) {
                        var node = range.startContainer;
                        if (node === input && range.startOffset > 0) {
                            var prev = input.childNodes[range.startOffset - 1];
                            if (prev && prev.nodeType === 1 && prev.getAttribute('contenteditable') === 'false') {
                                e.preventDefault();
                                prev.remove();
                                return;
                            }
                        } else if (node.nodeType === 3 && range.startOffset === 0) {
                            var prevSib = node.previousSibling;
                            if (prevSib && prevSib.nodeType === 1 && prevSib.getAttribute('contenteditable') === 'false') {
                                e.preventDefault();
                                prevSib.remove();
                                return;
                            }
                        }
                    }
                }
            }
        });
        input.addEventListener('blur', function() { setTimeout(function() { acBox.style.display = 'none'; }, 200); });

        document.getElementById('he-formula-close').addEventListener('click', function() { modal.remove(); });
        document.getElementById('he-formula-cancel').addEventListener('click', function() { modal.remove(); });
        document.getElementById('he-formula-clear').addEventListener('click', function() {
            // Clear the editor in place - does not save or close; Save commits it.
            input.innerHTML = '';
            var errDiv = document.getElementById('he-formula-error');
            if (errDiv) errDiv.remove();
            input.focus();
        });
        modal.addEventListener('click', function(e) { if (e.target === modal) modal.remove(); });
        document.getElementById('he-formula-save').addEventListener('click', function() {
            var val = getFormulaText();
            if (!val) {
                // Empty formula = clear it
                engineSettings.groups[gi].roles[ri].formula = '';
                saveSettings();
                modal.remove(); renderGroups(); return;
            }
            // Validate: replace known variables with 1, then try to evaluate.
            // Sort longest-first so short vars (e.g. size "l") don't clobber
            // substrings of longer names (e.g. "Linear-Sorter-hourly").
            var testExpr = val;
            allVars.slice().sort(function(a, b) { return b.length - a.length; }).forEach(function(v) {
                testExpr = testExpr.replace(new RegExp(v.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), '1');
            });
            try {
                var result = runFormulaExpr(testExpr);
                if (typeof result !== 'number' || isNaN(result)) throw new Error('Not a number');
                engineSettings.groups[gi].roles[ri].formula = val;
                saveSettings();
                modal.remove();
                renderGroups();
            } catch(e) {
                var errDiv = document.getElementById('he-formula-error');
                if (!errDiv) {
                    errDiv = document.createElement('div');
                    errDiv.id = 'he-formula-error';
                    var _errDark = GM_getValue('he-theme', 'light') === 'dark';
                    var _errBg = _errDark ? '#2d1215' : '#fdecea';
                    var _errFg = _errDark ? '#ff6b6b' : '#b42318';
                    errDiv.style.cssText = 'margin-top:8px;padding:6px 10px;background:' + _errBg + ';border:1px solid #da3633;border-radius:4px;color:' + _errFg + ';font-size:11px';
                    input.parentNode.after(errDiv);
                }
                errDiv.textContent = '⚠ Invalid formula: ' + e.message;
            }
        });
    }

    function initEventHandlers() {
        // Render groups on init
        renderGroups();

        // Add Group button
        var addGrpBtn = document.getElementById('he-add-group');
        if (addGrpBtn) addGrpBtn.addEventListener('click', function() {
            collectGroupsFromDOM();
            if (!engineSettings.groups) engineSettings.groups = [];
            engineSettings.groups.push({ name: '', color: '#6b21a8', roles: [] });
            saveSettings(); renderGroups();
        });

        var checkGraphBtn = document.getElementById('he-check-graph');
        if (checkGraphBtn) checkGraphBtn.addEventListener('click', function() { openGraphCheckModal(); });

        // Tab switching
        var tabs = document.querySelectorAll('.he-tab');
        tabs.forEach(function(tab) {
            tab.addEventListener('click', function() {
                tabs.forEach(function(t) {
                    t.style.borderBottomColor = 'transparent';
                    t.style.color = 'var(--he-muted)';
                });
                tab.style.borderBottomColor = '#a020b8';
                tab.style.color = 'var(--he-text)';
                document.querySelectorAll('.he-tab-content').forEach(function(c) {
                    c.style.display = 'none';
                });
                document.getElementById('he-tab-' + tab.getAttribute('data-tab')).style.display = 'flex';
                if (tab.getAttribute('data-tab') === 'plan') renderPlanTab();
                if (tab.getAttribute('data-tab') === 'execute') renderExecuteTab();
            });
        });

        // Execute tab: Optimize button + AI chat send
        var _optBtn = document.getElementById('he-exec-optimize');
        if (_optBtn) _optBtn.addEventListener('click', function() { execRunOptimizer(null); });
        var _execSend = document.getElementById('he-exec-ai-send');
        var _execInp = document.getElementById('he-exec-ai-input');
        function _execDoSend() { if (!_execInp) return; var q = (_execInp.value || '').trim(); if (!q) return; _execInp.value = ''; execRunOptimizer(q); }
        if (_execSend) _execSend.addEventListener('click', _execDoSend);
        if (_execInp) _execInp.addEventListener('keydown', function(e) { if (e.key === 'Enter') { e.preventDefault(); _execDoSend(); } });

        // Settings items hover + click
        var settingItems = document.querySelectorAll('.he-setting-item');
        settingItems.forEach(function(item) {
            item.addEventListener('mouseenter', function() {
                item.style.background = 'var(--he-panel)';
                item.style.borderLeftColor = '#a020b8';
            });
            item.addEventListener('mouseleave', function() {
                item.style.background = 'none';
                item.style.borderLeftColor = 'transparent';
            });
            item.addEventListener('click', function() {
                openSettingModal(item.getAttribute('data-setting'));
            });
        });
    }


    // Engine settings storage
    var engineSettings = GM_getValue('he-settings', { siteCode: '' });
    var enginePresets = GM_getValue('he-presets', {});
    var activePresetId = GM_getValue('he-active-preset', '');

    function saveSettings() {
        GM_setValue('he-settings', engineSettings);
        // Also update active preset snapshot
        if (activePresetId && enginePresets[activePresetId]) {
            enginePresets[activePresetId].settings = JSON.parse(JSON.stringify(engineSettings));
            savePresets();
        }
    }
    function savePresets() { GM_setValue('he-presets', enginePresets); GM_setValue('he-active-preset', activePresetId); }

    function getSettingContent(settingId) {
        if (settingId === 'site-code') {
            return '<label style="display:block;margin-bottom:8px;color:var(--he-text);font-size:12px">Site Code</label>' +
                '<input id="he-set-site-code" type="text" value="' + (engineSettings.siteCode || '') + '" placeholder="e.g. ORD9" style="width:100%;padding:8px 12px;background:var(--he-bg);border:1px solid var(--he-border);border-radius:6px;color:var(--he-text);font-size:13px">';
        }
        if (settingId === 'presets') {
            var html = '<div style="margin-bottom:12px">';
            // List existing presets
            var ids = Object.keys(enginePresets);
            if (ids.length === 0) {
                html += '<div style="color:#555;font-size:11px;margin-bottom:10px">No presets saved yet.</div>';
            } else {
                var _prDark = GM_getValue('he-theme', 'light') === 'dark';
                var _prSelBg = _prDark ? '#1a3a2a' : '#e6f4ea';
                ids.forEach(function(id) {
                    var p = enginePresets[id];
                    var isActive = (id === activePresetId);
                    html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:6px 10px;margin-bottom:4px;background:' + (isActive ? _prSelBg : 'var(--he-bg)') + ';border:1px solid ' + (isActive ? '#2ea043' : 'var(--he-border)') + ';border-radius:6px">';
                    html += '<span style="font-size:12px;color:var(--he-text)">' + p.name + (isActive ? ' <span style="color:#2ea043;font-size:10px">● active</span>' : '') + '</span>';
                    html += '<div style="display:flex;gap:4px">';
                    html += '<button class="he-preset-load" data-id="' + id + '" style="padding:2px 8px;background:#1f6feb;border:none;border-radius:3px;color:#fff;font-size:10px;cursor:pointer">Load</button>';
                    html += '<button class="he-preset-del" data-id="' + id + '" style="padding:2px 8px;background:#da3633;border:none;border-radius:3px;color:#fff;font-size:10px;cursor:pointer">✕</button>';
                    html += '</div></div>';
                });
            }
            html += '</div>';
            // Create new
            html += '<div style="border-top:1px solid var(--he-border);padding-top:10px;margin-bottom:10px">';
            html += '<label style="display:block;margin-bottom:4px;color:var(--he-muted);font-size:11px">New preset name:</label>';
            html += '<div style="display:flex;gap:6px"><input id="he-preset-name" type="text" placeholder="e.g. Day Sort" style="flex:1;padding:6px 10px;background:var(--he-bg);border:1px solid var(--he-border);border-radius:4px;color:var(--he-text);font-size:12px">';
            html += '<button id="he-preset-create" style="padding:6px 12px;background:#1a6b2a;border:1px solid #2ea043;border-radius:4px;color:#fff;font-size:11px;cursor:pointer">Create</button></div>';
            html += '</div>';
            // Import / Export
            html += '<div style="border-top:1px solid var(--he-border);padding-top:10px;display:flex;gap:6px">';
            html += '<button id="he-preset-export" style="padding:5px 10px;background:none;border:1px solid var(--he-border);border-radius:4px;color:var(--he-muted);font-size:11px;cursor:pointer">📤 Export Active</button>';
            html += '<button id="he-preset-import" style="padding:5px 10px;background:none;border:1px solid var(--he-border);border-radius:4px;color:var(--he-muted);font-size:11px;cursor:pointer">📥 Import</button>';
            html += '</div>';
            return html;
        }
        if (settingId === 'plan-mode') {
            var current = engineSettings.planMode || '';
            var modes = [
                { id: 'golden-eye', name: 'Golden Eye', desc: 'Pull Headcounts from Golden Eye' },
                { id: 'simple', name: 'Simple', desc: 'Enter total volume plan, estimate package breakdown' },
                { id: 'scaling', name: 'Scaling', desc: 'Enter total volume plan, pull inbound data, scale data to fit plan' },
                { id: 'exact', name: 'Exact', desc: 'Pull inbound data, and use precise package breakdown' },
                { id: 'deep-dive', name: 'Deep Dive', desc: 'Pull inbound data from packageflix, including stacking filters' }
            ];
            var html = '<div style="margin-bottom:8px;color:var(--he-muted);font-size:11px">Select planning mode:</div>';
            var _pmDark = GM_getValue('he-theme', 'light') === 'dark';
            var selBg = _pmDark ? '#1a3a2a' : '#e6f4ea';
            modes.forEach(function(m) {
                var sel = (current === m.id);
                html += '<label class="he-mode-label" data-mode="' + m.id + '" style="display:flex;align-items:flex-start;gap:8px;padding:8px 10px;margin-bottom:4px;background:' + (sel ? selBg : 'var(--he-bg)') + ';border:1px solid ' + (sel ? '#2ea043' : 'var(--he-border)') + ';border-radius:6px;cursor:pointer">';
                html += '<input type="radio" name="he-plan-mode" value="' + m.id + '"' + (sel ? ' checked' : '') + ' style="margin-top:2px">';
                html += '<div style="flex:1"><div style="font-size:12px;font-weight:600;color:var(--he-text)">' + m.name + '</div><div style="font-size:11px;color:var(--he-muted)">' + m.desc + '</div></div>';
                if (m.id === 'simple') {
                    html += '<button id="he-pkg-breakdown-btn" style="padding:3px 8px;background:#1f6feb;border:none;border-radius:4px;color:#fff;font-size:10px;cursor:pointer;white-space:nowrap" title="Set package breakdown percentages">📦 Mix</button>';
                }
                html += '</label>';
            });
            return html;
        }
        if (settingId === 'mhe-type-attrs') {
            if (!engineSettings.mheTypes || engineSettings.mheTypes.length === 0) {
                return '<div style="color:#da3633;font-size:12px;padding:10px 0">⚠ No MHE types defined. Please add MHE types in "MHE Type List" first.</div>';
            }
            if (!engineSettings.mheAttrs) engineSettings.mheAttrs = {};
            var attrs = FORMULA_MHE_ATTRS;
            var types = engineSettings.mheTypes;
            var html = '<div style="overflow-x:auto;font-size:11px">';
            html += '<table style="width:100%;border-collapse:collapse">';
            // Header row
            html += '<tr><td style="padding:4px 6px;font-weight:600;color:var(--he-muted);border-bottom:1px solid var(--he-border)">Attribute</td>';
            types.forEach(function(t) {
                html += '<td style="padding:4px 6px;font-weight:600;color:var(--he-text);text-align:center;border-bottom:1px solid var(--he-border);min-width:70px">' + t + '</td>';
            });
            html += '</tr>';
            // Data rows
            attrs.forEach(function(attr) {
                html += '<tr>';
                html += '<td style="padding:3px 6px;color:var(--he-text);border-bottom:1px solid var(--he-border2);white-space:nowrap">' + attr + '</td>';
                types.forEach(function(t) {
                    var key = t + '|' + attr;
                    var val = engineSettings.mheAttrs[key] || '0';
                    html += '<td style="padding:2px 4px;border-bottom:1px solid var(--he-border2);text-align:center">';
                    html += '<input class="he-mhe-attr" data-key="' + key + '" type="text" value="' + val + '" style="width:55px;padding:3px 4px;background:var(--he-bg);border:1px solid var(--he-border);border-radius:3px;color:var(--he-text);font-size:11px;text-align:center;-moz-appearance:textfield;appearance:textfield">';
                    html += '</td>';
                });
                html += '</tr>';
            });
            html += '</table></div>';
            return html;
        }
        if (settingId === 'mhe-type-list') {
            if (!engineSettings.mheTypes) engineSettings.mheTypes = [];
            var html = '<div style="margin-bottom:10px">';
            engineSettings.mheTypes.forEach(function(name, i) {
                html += '<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">';
                html += '<input class="he-mhe-name" data-idx="' + i + '" type="text" value="' + (name || '') + '" placeholder="e.g. Auto Sorter" style="flex:1;padding:6px 10px;background:var(--he-bg);border:1px solid var(--he-border);border-radius:4px;color:var(--he-text);font-size:12px">';
                html += '<button class="he-mhe-del" data-idx="' + i + '" style="padding:4px 8px;background:#da3633;border:none;border-radius:3px;color:#fff;font-size:10px;cursor:pointer">✕</button>';
                html += '</div>';
            });
            if (engineSettings.mheTypes.length === 0) {
                html += '<div style="color:#555;font-size:11px">No MHE types defined yet.</div>';
            }
            html += '</div>';
            html += '<button id="he-mhe-add" style="padding:5px 12px;background:#1f6feb;border:none;border-radius:4px;color:#fff;font-size:11px;cursor:pointer">+ Add MHE</button>';
            return html;
        }
        if (settingId === 'sort-times') {
            if (!engineSettings.sortTimes) engineSettings.sortTimes = [];
            var html = '<div style="margin-bottom:10px">';
            engineSettings.sortTimes.forEach(function(s, i) {
                html += '<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">';
                html += '<input class="he-sort-name" data-idx="' + i + '" type="text" value="' + (s.name || '') + '" placeholder="Name" style="width:90px;padding:6px 8px;background:var(--he-bg);border:1px solid var(--he-border);border-radius:4px;color:var(--he-text);font-size:12px">';
                html += '<input class="he-sort-start" data-idx="' + i + '" type="text" value="' + (s.start || '') + '" placeholder="Start" style="width:70px;padding:6px 8px;background:var(--he-bg);border:1px solid var(--he-border);border-radius:4px;color:var(--he-text);font-size:12px">';
                html += '<input class="he-sort-end" data-idx="' + i + '" type="text" value="' + (s.end || '') + '" placeholder="End" style="width:70px;padding:6px 8px;background:var(--he-bg);border:1px solid var(--he-border);border-radius:4px;color:var(--he-text);font-size:12px">';
                html += '<button class="he-sort-del" data-idx="' + i + '" style="padding:4px 8px;background:#da3633;border:none;border-radius:3px;color:#fff;font-size:10px;cursor:pointer">✕</button>';
                html += '</div>';
            });
            if (engineSettings.sortTimes.length === 0) {
                html += '<div style="color:#555;font-size:11px">No sorts defined yet.</div>';
            }
            html += '</div>';
            html += '<button id="he-sort-add" style="padding:5px 12px;background:#1f6feb;border:none;border-radius:4px;color:#fff;font-size:11px;cursor:pointer">+ Add Sort</button>';
            return html;
        if (settingId === 'learned-rules') {
            var lr = getLearnedRules();
            if (!lr.length) return '<div style="color:var(--he-muted);font-size:12px;padding:10px 0">No learned rules yet. When you correct the Execute AI (e.g. \u201Cnever pull waterspiders\u201D), it will propose rules to remember here.</div>';
            var h2 = '<div style="max-height:340px;overflow-y:auto">';
            lr.forEach(function(r) {
                var retired = r.status !== 'active';
                var health = '';
                if (!retired && (r.overrideCount || 0) >= 3) health = '<div style="color:#d13438;font-size:10px">\u26A0 Overridden ' + r.overrideCount + ' times \u2014 consider retiring or revising.</div>';
                else if (!retired && (r.bindCount || 0) === 0) health = '<div style="color:var(--he-muted);font-size:10px">Never bound an optimization yet.</div>';
                h2 += '<div style="padding:8px 10px;border:1px solid var(--he-border);border-radius:6px;margin-bottom:6px;' + (retired ? 'opacity:0.5;' : '') + '">'
                    + '<div style="color:var(--he-text);font-size:12px">\u201C' + execEsc(r.text) + '\u201D</div>'
                    + '<div style="color:var(--he-muted);font-size:10px;margin-top:3px">Scope: ' + execEsc(r.scope) + ' \u00B7 Learned ' + execEsc(r.learnedAt) + (r.source ? ' from \u201C' + execEsc(r.source) + '\u201D' : '') + '</div>'
                    + '<div style="color:var(--he-muted);font-size:10px">Applied ' + (r.bindCount || 0) + '\u00D7' + (r.lastBoundAt ? ' (last ' + r.lastBoundAt + ')' : '') + ' \u00B7 Overridden ' + (r.overrideCount || 0) + '\u00D7' + (retired ? ' \u00B7 RETIRED' : '') + '</div>'
                    + health
                    + '<div style="margin-top:5px;display:flex;gap:6px">'
                    + (retired
                        ? '<button class="he-lr-restore" data-id="' + r.id + '" style="padding:2px 8px;background:var(--he-border);border:1px solid var(--he-border2);border-radius:4px;color:var(--he-text);font-size:10px;cursor:pointer">Restore</button>'
                        : '<button class="he-lr-retire" data-id="' + r.id + '" style="padding:2px 8px;background:none;border:1px solid #d13438;border-radius:4px;color:#d13438;font-size:10px;cursor:pointer">Retire</button>')
                    + '<button class="he-lr-delete" data-id="' + r.id + '" style="padding:2px 8px;background:none;border:1px solid var(--he-border);border-radius:4px;color:var(--he-muted);font-size:10px;cursor:pointer">Delete</button>'
                    + '</div></div>';
            });
            h2 += '</div>';
            return h2;
        }
        }
        if (settingId === 'engineer-rates') {
            if (!engineSettings.engineerRates || !engineSettings._erSeeded) {
                engineSettings.engineerRates = [
                {desc:'Problem Solve Gate Keeper',rate:'50'},{desc:'Problem Solve Processing',rate:'30'},
                {desc:'Robin Induct',rate:'500'},{desc:'AR Induct',rate:'400'},{desc:'AFM',rate:'500'},
                {desc:'Jam Clear',rate:'5000'},{desc:'TDR',rate:'10000'},
                {desc:'Fluid Unload (Sortable)',rate:'1500'},{desc:'Fluid Unload (TNS)',rate:'750'},
                {desc:'Shuttle Dumper',rate:'1300'},{desc:'Container Unload',rate:'9000'},{desc:'Missort',rate:'N/A'},
                {desc:'Build to pallet',rate:'350'},{desc:'Scan to container (small)',rate:'190'},
                {desc:'Scan to container (medium)',rate:'117'},{desc:'Scan to container (large)',rate:'93'},
                {desc:'Sort Waterspider',rate:'900'},{desc:'Cart wrangler',rate:'1500'},
                {desc:'Sort NC Processing',rate:'85'},{desc:'NC Waterspider',rate:'50'},
                {desc:'NC Staging',rate:'60'},{desc:'NC Runner',rate:'60'},{desc:'NC Feeder',rate:'250'},
                {desc:'OB Stager DDU',rate:'1200'},{desc:'OB Stager AMZL/RSR',rate:'1000'},
                {desc:'Dock Associate',rate:'1200'},{desc:'XD Loaders',rate:'3000'},
                {desc:'XD Unloaders',rate:'9000'},{desc:'AMZL Sortable Loaders',rate:'3000'},{desc:'Merge',rate:'150'}
            ];
                engineSettings._erSeeded = true;
                saveSettings();
            }
            var html = '<div style="margin-bottom:10px;max-height:350px;overflow-y:auto;padding-right:12px">';
            engineSettings.engineerRates.forEach(function(item, i) {
                html += '<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">';
                html += '<input class="he-erate-desc" data-idx="' + i + '" type="text" value="' + (item.desc || '') + '" placeholder="Description" style="flex:1;padding:5px 8px;background:var(--he-bg);border:1px solid var(--he-border);border-radius:4px;color:var(--he-text);font-size:11px">';
                html += '<input class="he-erate-val" data-idx="' + i + '" type="text" value="' + (item.rate || '') + '" placeholder="#" style="width:60px;padding:5px 8px;background:var(--he-bg);border:1px solid var(--he-border);border-radius:4px;color:var(--he-text);font-size:11px;text-align:center">';
                html += '<button class="he-erate-del" data-idx="' + i + '" style="padding:3px 6px;background:#da3633;border:none;border-radius:3px;color:#fff;font-size:9px;cursor:pointer">✕</button>';
                html += '</div>';
            });
            if (engineSettings.engineerRates.length === 0) {
                html += '<div style="color:#555;font-size:11px">No engineer rates defined yet.</div>';
            }
            html += '</div>';
            html += '<button id="he-erate-add" style="padding:5px 12px;background:#1f6feb;border:none;border-radius:4px;color:#fff;font-size:11px;cursor:pointer">+ Add Rate</button>';
            return html;
        }
        if (settingId === 'volume-mix') {
            if (!engineSettings.mheTypes || engineSettings.mheTypes.length === 0) {
                return '<div style="color:#da3633;font-size:12px;padding:10px 0">⚠ No MHE types defined. Please add MHE types in "MHE Type List" first.</div>';
            }
            if (!engineSettings.volumeMix) engineSettings.volumeMix = {};
            var sizes = ['Extra Small', 'Small', 'Medium', 'Large', 'Extra Large', 'Non-Con', 'Non-Con Plus'];
            var types = engineSettings.mheTypes;
            var html = '<div style="overflow-x:auto;font-size:11px">';
            html += '<table style="width:100%;border-collapse:collapse">';
            // Header
            html += '<tr><td style="padding:4px 6px;font-weight:600;color:var(--he-muted);border-bottom:1px solid var(--he-border)">Volume Mix %</td>';
            types.forEach(function(t) {
                html += '<td style="padding:4px 6px;font-weight:600;color:var(--he-text);text-align:center;border-bottom:1px solid var(--he-border);min-width:60px">' + t + '</td>';
            });
            html += '<td style="padding:4px 6px;font-weight:600;color:var(--he-muted);text-align:center;border-bottom:1px solid var(--he-border)">Total</td></tr>';
            // Rows
            sizes.forEach(function(size) {
                html += '<tr data-row="' + size + '">';
                html += '<td style="padding:3px 6px;color:var(--he-text);border-bottom:1px solid var(--he-border2);white-space:nowrap">' + size + '</td>';
                types.forEach(function(t) {
                    var key = t + '|' + size;
                    var val = engineSettings.volumeMix[key] || '0';
                    html += '<td style="padding:2px 4px;border-bottom:1px solid var(--he-border2);text-align:center">';
                    html += '<input class="he-vmix" data-key="' + key + '" data-row="' + size + '" type="text" value="' + val + '" style="width:50px;padding:3px 4px;background:var(--he-bg);border:1px solid var(--he-border);border-radius:3px;color:var(--he-text);font-size:11px;text-align:center">';
                    html += '</td>';
                });
                html += '<td class="he-vmix-total" data-row="' + size + '" style="padding:3px 6px;border-bottom:1px solid var(--he-border2);text-align:center;font-weight:600;font-size:11px">0%</td>';
                html += '</tr>';
            });
            html += '</table></div>';
            return html;
        }
        return 'Setting editor for <strong style="color:var(--he-text)">' + settingId + '</strong> coming soon.';
    }

    function handleSettingSave(settingId) {
        if (settingId === 'site-code') {
            var val = document.getElementById('he-set-site-code');
            if (val) {
                engineSettings.siteCode = val.value.trim().toUpperCase();
                saveSettings();
                var disp = document.getElementById('he-site-display');
                if (disp) disp.textContent = engineSettings.siteCode || '—';
            }
        }
        if (settingId === 'plan-mode') {
            var selected = document.querySelector('input[name="he-plan-mode"]:checked');
            if (selected) { engineSettings.planMode = selected.value; saveSettings(); }
        }
        if (settingId === 'mhe-type-list') {
            var inputs = document.querySelectorAll('.he-mhe-name');
            engineSettings.mheTypes = [];
            inputs.forEach(function(el) { if (el.value.trim()) engineSettings.mheTypes.push(el.value.trim()); });
            saveSettings();
        }
        if (settingId === 'mhe-type-attrs') {
            if (!engineSettings.mheAttrs) engineSettings.mheAttrs = {};
            document.querySelectorAll('.he-mhe-attr').forEach(function(el) {
                engineSettings.mheAttrs[el.getAttribute('data-key')] = el.value.trim();
            });
            saveSettings();
        }
        if (settingId === 'volume-mix') {
            if (!engineSettings.volumeMix) engineSettings.volumeMix = {};
            document.querySelectorAll('.he-vmix').forEach(function(el) {
                engineSettings.volumeMix[el.getAttribute('data-key')] = el.value.trim();
            });
            saveSettings();
        }
        if (settingId === 'engineer-rates') {
            var descs = document.querySelectorAll('.he-erate-desc');
            var vals = document.querySelectorAll('.he-erate-val');
            engineSettings.engineerRates = [];
            descs.forEach(function(el, i) {
                engineSettings.engineerRates.push({ desc: el.value.trim(), rate: vals[i] ? vals[i].value.trim() : '' });
            });
            saveSettings();
        }
        if (settingId === 'sort-times') {
            var names = document.querySelectorAll('.he-sort-name');
            var starts = document.querySelectorAll('.he-sort-start');
            var ends = document.querySelectorAll('.he-sort-end');
            engineSettings.sortTimes = [];
            starts.forEach(function(el, i) {
                var nameEl = names[i];
                var endEl = ends[i];
                engineSettings.sortTimes.push({ name: nameEl ? nameEl.value.trim() : '', start: el.value.trim(), end: endEl ? endEl.value.trim() : '' });
            });
            saveSettings();
        }
        // Presets don't use the Save button — they have their own buttons
    }

    function attachLearnedRuleHandlers() {
        function findRule(btn) {
            var id = btn.getAttribute('data-id');
            return getLearnedRules().find(function(x) { return x.id === id; });
        }
        document.querySelectorAll('.he-lr-retire').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var r = findRule(btn); if (r) { r.status = 'retired'; saveSettings(); openSettingModal('learned-rules'); }
            });
        });
        document.querySelectorAll('.he-lr-restore').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var r = findRule(btn); if (r) { r.status = 'active'; saveSettings(); openSettingModal('learned-rules'); }
            });
        });
        document.querySelectorAll('.he-lr-delete').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var id = btn.getAttribute('data-id');
                engineSettings.learnedRules = getLearnedRules().filter(function(x) { return x.id !== id; });
                saveSettings(); openSettingModal('learned-rules');
            });
        });
    }

    function attachPresetHandlers() {
        // Create
        var createBtn = document.getElementById('he-preset-create');
        if (createBtn) createBtn.addEventListener('click', function() {
            var nameEl = document.getElementById('he-preset-name');
            var name = nameEl ? nameEl.value.trim() : '';
            if (!name) return;
            var id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
            enginePresets[id] = { name: name, settings: JSON.parse(JSON.stringify(engineSettings)) };
            activePresetId = id;
            savePresets();
            openSettingModal('presets'); // refresh
        });
        // Load
        document.querySelectorAll('.he-preset-load').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var id = btn.getAttribute('data-id');
                if (enginePresets[id]) {
                    engineSettings = JSON.parse(JSON.stringify(enginePresets[id].settings));
                    activePresetId = id;
                    saveSettings(); savePresets();
                    var disp = document.getElementById('he-site-display');
                    if (disp) disp.textContent = engineSettings.siteCode || '—';
                    renderGroups();
                    openSettingModal('presets');
                }
            });
        });
        // Delete
        document.querySelectorAll('.he-preset-del').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var id = btn.getAttribute('data-id');
                delete enginePresets[id];
                if (activePresetId === id) activePresetId = '';
                savePresets();
                openSettingModal('presets');
            });
        });
        // Export active preset
        var exportBtn = document.getElementById('he-preset-export');
        if (exportBtn) exportBtn.addEventListener('click', function() {
            if (!activePresetId || !enginePresets[activePresetId]) { alert('No active preset to export.'); return; }
            var obj = {}; obj[activePresetId] = enginePresets[activePresetId];
            var json = JSON.stringify(obj, null, 2);
            navigator.clipboard.writeText(json).then(function() { alert('Preset "' + enginePresets[activePresetId].name + '" copied to clipboard!'); });
        });
        // Import
        var importBtn = document.getElementById('he-preset-import');
        if (importBtn) importBtn.addEventListener('click', function() {
            var json = prompt('Paste exported presets JSON:');
            if (!json) return;
            try {
                var imported = JSON.parse(json);
                Object.keys(imported).forEach(function(k) { enginePresets[k] = imported[k]; });
                savePresets();
                openSettingModal('presets');
            } catch(e) { alert('Invalid JSON'); }
        });
    }


    function openPackageBreakdownModal() {
        var existing = document.getElementById('he-pkg-modal');
        if (existing) existing.remove();
        if (!engineSettings.packageBreakdown) {
            engineSettings.packageBreakdown = { extraSmall: '29.37', small: '19.73', medium: '17.91', large: '18.09', extraLarge: '8.63', nonCon: '3.45', nonConPlus: '2.83' };
        }
        var bd = engineSettings.packageBreakdown;
        var fields = [
            { key: 'extraSmall', label: 'Extra Small' },
            { key: 'small', label: 'Small' },
            { key: 'medium', label: 'Medium' },
            { key: 'large', label: 'Large' },
            { key: 'extraLarge', label: 'Extra Large' },
            { key: 'nonCon', label: 'Non Con' },
            { key: 'nonConPlus', label: 'Non Con+' }
        ];
        var html = '<div style="margin-bottom:12px;color:var(--he-muted);font-size:11px">Enter percentage breakdown (should sum to 100%):</div>';
        fields.forEach(function(f) {
            html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">';
            html += '<span style="font-size:12px;color:var(--he-text)">' + f.label + '</span>';
            html += '<div style="display:flex;align-items:center;gap:4px"><input id="he-pkg-' + f.key + '" type="number" value="' + (bd[f.key] || '') + '" placeholder="%" style="width:60px;padding:5px 8px;background:var(--he-bg);border:1px solid var(--he-border);border-radius:4px;color:var(--he-text);font-size:12px;text-align:right;-moz-appearance:textfield;appearance:textfield"><span style="color:var(--he-muted);font-size:11px">%</span></div>';
            html += '</div>';
        });
        html += '<div id="he-pkg-total" style="margin-top:10px;padding:8px 10px;border-radius:4px;font-size:12px;font-weight:600;text-align:right"></div>';
        // Fluid / Containerized split (own pair, not part of the size sum)
        if (!engineSettings.fcBreakdown) engineSettings.fcBreakdown = { fluid: '', containerized: '' };
        var fc = engineSettings.fcBreakdown;
        html += '<div style="border-top:1px solid var(--he-border);margin-top:12px;padding-top:10px;margin-bottom:8px;color:var(--he-muted);font-size:11px">Fluid / Containerized split (% of total volume, used in Simple mode):</div>';
        [{ key: 'fluid', label: 'Fluid' }, { key: 'containerized', label: 'Containerized' }].forEach(function(f) {
            html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">';
            html += '<span style="font-size:12px;color:var(--he-text)">' + f.label + '</span>';
            html += '<div style="display:flex;align-items:center;gap:4px"><input id="he-fc-' + f.key + '" type="number" value="' + (fc[f.key] || '') + '" placeholder="%" style="width:60px;padding:5px 8px;background:var(--he-bg);border:1px solid var(--he-border);border-radius:4px;color:var(--he-text);font-size:12px;text-align:right;-moz-appearance:textfield;appearance:textfield"><span style="color:var(--he-muted);font-size:11px">%</span></div>';
            html += '</div>';
        });

        var modal = document.createElement('div');
        modal.id = 'he-pkg-modal';
        modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:100001;display:flex;align-items:center;justify-content:center';
        modal.innerHTML =
            '<div style="background:var(--he-panel);border:1px solid var(--he-border);border-radius:10px;padding:20px;min-width:280px;box-shadow:0 8px 30px rgba(0,0,0,0.8)">' +
                '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">' +
                    '<span style="font-size:14px;font-weight:600;color:var(--he-text)">Package Breakdown</span>' +
                    '<button id="he-pkg-close" style="background:none;border:none;color:var(--he-muted);font-size:18px;cursor:pointer">✕</button>' +
                '</div>' +
                '<div id="he-pkg-fields">' + html + '</div>' +
                '<div style="display:flex;justify-content:flex-end;gap:8px;margin-top:14px">' +
                    '<button id="he-pkg-cancel" style="padding:6px 14px;background:none;border:1px solid var(--he-border);border-radius:6px;color:var(--he-muted);font-size:12px;cursor:pointer">Cancel</button>' +
                    '<button id="he-pkg-save" style="padding:6px 14px;background:#1f6feb;border:none;border-radius:6px;color:#fff;font-size:12px;cursor:pointer">Save</button>' +
                '</div>' +
            '</div>';
        document.body.appendChild(modal);

        document.getElementById('he-pkg-close').addEventListener('click', function() { modal.remove(); });
        document.getElementById('he-pkg-cancel').addEventListener('click', function() { modal.remove(); });
        modal.addEventListener('click', function(e) { if (e.target === modal) modal.remove(); });

        // Hide number spinners
        var style = document.createElement('style');
        style.textContent = '#he-pkg-modal input[type=number]::-webkit-inner-spin-button,#he-pkg-modal input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}';
        modal.appendChild(style);

        // Running total
        function updateTotal() {
            var sum = 0;
            fields.forEach(function(f) {
                var el = document.getElementById('he-pkg-' + f.key);
                if (el && el.value) sum += parseFloat(el.value) || 0;
            });
            var totalEl = document.getElementById('he-pkg-total');
            var saveBtn = document.getElementById('he-pkg-save');
            if (totalEl) {
                var isGood = (Math.abs(sum - 100) < 0.1);
                var _pbDark = GM_getValue('he-theme', 'light') === 'dark';
                totalEl.style.color = isGood ? (_pbDark ? '#3fb950' : '#1a7f37') : (_pbDark ? '#ff6b6b' : '#b42318');
                totalEl.style.background = isGood ? (_pbDark ? '#1a3a2a' : '#e6f4ea') : (_pbDark ? '#2d1215' : '#fdecea');
                totalEl.textContent = 'Total: ' + sum.toFixed(1) + '%' + (isGood ? ' ✓' : '');
                if (saveBtn) {
                    saveBtn.disabled = !isGood;
                    saveBtn.style.opacity = isGood ? '1' : '0.4';
                    saveBtn.style.cursor = isGood ? 'pointer' : 'not-allowed';
                }
            }
        }
        fields.forEach(function(f) {
            var el = document.getElementById('he-pkg-' + f.key);
            if (el) el.addEventListener('input', updateTotal);
        });
        updateTotal();

        document.getElementById('he-pkg-save').addEventListener('click', function() {
            fields.forEach(function(f) {
                var el = document.getElementById('he-pkg-' + f.key);
                if (el) engineSettings.packageBreakdown[f.key] = el.value.trim();
            });
            if (!engineSettings.fcBreakdown) engineSettings.fcBreakdown = {};
            ['fluid', 'containerized'].forEach(function(k) {
                var el = document.getElementById('he-fc-' + k);
                if (el) engineSettings.fcBreakdown[k] = el.value.trim();
            });
            saveSettings();
            modal.remove();
        });
    }

    function openSettingModal(settingId) {
        // Remove existing modal if any
        var existing = document.getElementById('he-setting-modal');
        if (existing) existing.remove();

        var titles = {
            'site-code': 'Site Code',
            'presets': 'Presets',
            'sort-times': 'Sort Times',
            'plan-mode': 'Plan Mode',
            'mhe-type-list': 'MHE Type List',
            'mhe-type-attrs': 'MHE Type Attributes',
            'volume-mix': 'Volume Mix',
            'engineer-rates': 'Engineer Rates',
            'learned-rules': 'Learned Rules'
        };

        var modal = document.createElement('div');
        modal.id = 'he-setting-modal';
        modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:100000;display:flex;align-items:center;justify-content:center';
        modal.innerHTML =
            '<div style="background:var(--he-panel);border:1px solid var(--he-border);border-radius:10px;padding:20px;min-width:320px;max-width:500px;box-shadow:0 8px 30px rgba(0,0,0,0.8)">' +
                '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">' +
                    '<span style="font-size:14px;font-weight:600;color:var(--he-text)">' + (titles[settingId] || settingId) + '</span>' +
                    '<button id="he-modal-close" style="background:none;border:none;color:var(--he-muted);font-size:18px;cursor:pointer">✕</button>' +
                '</div>' +
                '<div id="he-modal-body" style="color:var(--he-muted);font-size:12px;padding:10px 0">' +
                    getSettingContent(settingId) +
                '</div>' +
                '<div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px">' +
                    '<button id="he-modal-cancel" style="padding:6px 14px;background:none;border:1px solid var(--he-border);border-radius:6px;color:var(--he-muted);font-size:12px;cursor:pointer">Cancel</button>' +
                    '<button id="he-modal-save" style="padding:6px 14px;background:#1f6feb;border:none;border-radius:6px;color:#fff;font-size:12px;cursor:pointer">Save</button>' +
                '</div>' +
            '</div>';
        document.body.appendChild(modal);

        document.getElementById('he-modal-close').addEventListener('click', function() { modal.remove(); });
        document.getElementById('he-modal-cancel').addEventListener('click', function() { modal.remove(); });
        document.getElementById('he-modal-save').addEventListener('click', function() { handleSettingSave(settingId); modal.remove(); });
        modal.addEventListener('click', function(e) { if (e.target === modal) modal.remove(); });
        if (settingId === 'presets') attachPresetHandlers();
        if (settingId === 'learned-rules') attachLearnedRuleHandlers();
        if (settingId === 'plan-mode') {
            var pkgBtn = document.getElementById('he-pkg-breakdown-btn');
            if (pkgBtn) pkgBtn.addEventListener('click', function(e) {
                e.preventDefault(); e.stopPropagation();
                openPackageBreakdownModal();
            });
            // Update label highlights on radio change and save immediately
            document.querySelectorAll('input[name="he-plan-mode"]').forEach(function(radio) {
                radio.addEventListener('change', function() {
                    var _selBg = GM_getValue('he-theme', 'light') === 'dark' ? '#1a3a2a' : '#e6f4ea';
                    document.querySelectorAll('.he-mode-label').forEach(function(lbl) {
                        var isSel = (lbl.getAttribute('data-mode') === radio.value && radio.checked);
                        lbl.style.background = isSel ? _selBg : 'var(--he-bg)';
                        lbl.style.borderColor = isSel ? '#2ea043' : 'var(--he-border)';
                    });
                    engineSettings.planMode = radio.value;
                    saveSettings();
                    renderGroups();
                });
            });
        }
        if (settingId === 'sort-times') {
            var addBtn = document.getElementById('he-sort-add');
            if (addBtn) addBtn.addEventListener('click', function() {
                if (!engineSettings.sortTimes) engineSettings.sortTimes = [];
                // Save current input values first
                var names = document.querySelectorAll('.he-sort-name');
                var starts = document.querySelectorAll('.he-sort-start');
                var ends = document.querySelectorAll('.he-sort-end');
                engineSettings.sortTimes = [];
                starts.forEach(function(el, i) {
                    engineSettings.sortTimes.push({ name: names[i] ? names[i].value.trim() : '', start: el.value.trim(), end: ends[i] ? ends[i].value.trim() : '' });
                });
                engineSettings.sortTimes.push({ name: '', start: '', end: '' });
                saveSettings();
                openSettingModal('sort-times');
            });
            document.querySelectorAll('.he-sort-del').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    // Save current values first
                    var names = document.querySelectorAll('.he-sort-name');
                    var starts = document.querySelectorAll('.he-sort-start');
                    var ends = document.querySelectorAll('.he-sort-end');
                    engineSettings.sortTimes = [];
                    starts.forEach(function(el, i) {
                        engineSettings.sortTimes.push({ name: names[i] ? names[i].value.trim() : '', start: el.value.trim(), end: ends[i] ? ends[i].value.trim() : '' });
                    });
                    var idx = parseInt(btn.getAttribute('data-idx'));
                    engineSettings.sortTimes.splice(idx, 1);
                    saveSettings();
                    openSettingModal('sort-times');
                });
            });
        }
        if (settingId === 'mhe-type-list') {
            var addBtn = document.getElementById('he-mhe-add');
            if (addBtn) addBtn.addEventListener('click', function() {
                var inputs = document.querySelectorAll('.he-mhe-name');
                engineSettings.mheTypes = [];
                inputs.forEach(function(el) { engineSettings.mheTypes.push(el.value.trim()); });
                engineSettings.mheTypes.push('');
                saveSettings();
                openSettingModal('mhe-type-list');
            });
            document.querySelectorAll('.he-mhe-del').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    var inputs = document.querySelectorAll('.he-mhe-name');
                    engineSettings.mheTypes = [];
                    inputs.forEach(function(el) { engineSettings.mheTypes.push(el.value.trim()); });
                    var idx = parseInt(btn.getAttribute('data-idx'));
                    engineSettings.mheTypes.splice(idx, 1);
                    saveSettings();
                    openSettingModal('mhe-type-list');
                });
            });
        }
        if (settingId === 'engineer-rates') {
            var addBtn = document.getElementById('he-erate-add');
            if (addBtn) addBtn.addEventListener('click', function() {
                var descs = document.querySelectorAll('.he-erate-desc');
                var vals = document.querySelectorAll('.he-erate-val');
                engineSettings.engineerRates = [];
                descs.forEach(function(el, i) {
                    engineSettings.engineerRates.push({ desc: el.value.trim(), rate: vals[i] ? vals[i].value.trim() : '' });
                });
                engineSettings.engineerRates.push({ desc: '', rate: '' });
                saveSettings();
                openSettingModal('engineer-rates');
            });
            document.querySelectorAll('.he-erate-del').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    var descs = document.querySelectorAll('.he-erate-desc');
                    var vals = document.querySelectorAll('.he-erate-val');
                    engineSettings.engineerRates = [];
                    descs.forEach(function(el, i) {
                        engineSettings.engineerRates.push({ desc: el.value.trim(), rate: vals[i] ? vals[i].value.trim() : '' });
                    });
                    var idx = parseInt(btn.getAttribute('data-idx'));
                    engineSettings.engineerRates.splice(idx, 1);
                    saveSettings();
                    openSettingModal('engineer-rates');
                });
            });
        }
        if (settingId === 'volume-mix') {
            function updateRowTotals() {
                var sizes = ['Extra Small', 'Small', 'Medium', 'Large', 'Extra Large', 'Non-Con', 'Non-Con Plus'];
                sizes.forEach(function(size) {
                    var inputs = document.querySelectorAll('.he-vmix[data-row="' + size + '"]');
                    var sum = 0;
                    inputs.forEach(function(el) { sum += parseFloat(el.value) || 0; });
                    var totalEl = document.querySelector('.he-vmix-total[data-row="' + size + '"]');
                    if (totalEl) {
                        var isGood = (Math.abs(sum - 100) < 0.1);
                        totalEl.style.color = isGood ? '#2ea043' : '#da3633';
                        totalEl.textContent = sum.toFixed(1) + '%';
                    }
                });
            }
            document.querySelectorAll('.he-vmix').forEach(function(el) {
                el.addEventListener('input', updateRowTotals);
            });
            updateRowTotals();
        }
    }

    function init() {
        console.log('[Hydra Engine] v' + ENGINE_VERSION + ' initializing...');
        createPanel();


        console.log('[Hydra Engine] Ready');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
