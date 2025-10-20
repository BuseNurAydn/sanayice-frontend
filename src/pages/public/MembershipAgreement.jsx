import React from 'react';
import { FaCalendarAlt, FaUsers, FaListOl, FaInfoCircle, FaCheckCircle, FaExclamationTriangle, FaShieldAlt, FaListUl } from 'react-icons/fa';
import { SlPeople } from "react-icons/sl";

const MembershipAgreement = () => {
    const sections = [
        {
            id: 'taraflar',
            title: 'TARAFLAR',
            icon: <SlPeople className="w-5 h-5" />,
            content: (
                <ul className="list-disc list-inside space-y-3 ml-4 text-gray-700">
                    <p>İşbu Satıcı Kullanıcı Üyelik Sözleşmesi ("Sözleşme"), bir tarafta Fenerbahçe Mah. İğrip Sk. No: 13 İç Kapı No: 1 Kadıköy/İstanbul adresinde bulunan Yılmaz Demirtaş ŞAHIS ŞİRKETİ (“Sanayice”) ile diğer tarafta kullanıcı (Üye/ Üyeler) arasında aşağıda belirtilen şartlar ve hükümler dâhilinde sözleşmenin Üye/Üyeler tarafından mobil uygulama ve/veya internet sitesi üzerinden Sanayice’nin sunmuş olduğu işbu sözleşmeyi onaylayarak ve/veya Platformu indirip kullanarak ve/veya Platform üzerinden işlem yaptığı anda yürürlüğe girmiştir.
                        İş bu sözleşme kapsamında Sanayice ve Üye ayrı ayrı "Taraf", birlikte "Taraflar" olarak anılacaktır.
                        İşbu Sözleşme’nin ekleri ve Sanayice tarafından sunulan hizmetlerinin kullanımına ilişkin tüm yazılı süreçler, açıklamalar ile ek diğer tüm dokümanlar Sözleşme’nin ayrılmaz birer parçası kabul edilecektir.
                    </p>
                </ul>
            ),
        },
        {
            id: 'tanimlar',
            title: 'TANIMLAR',
            icon: <FaListUl className="w-5 h-5" />,
            content: (
                <ul className="list-disc list-inside space-y-3 ml-4 text-gray-700">
                    <li>
                        <strong>PAZARYERİ:</strong> Sanayice’nin 6563 sayılı Elektronik Ticaretin Düzenlenmesi Hakkında Kanun uyarınca "elektronik ticaret aracı hizmet sağlayıcı" ve 5651 sayılı İnternet Ortamında Yapılan Yayınların Düzenlenmesi ve Bu Yayınlar Yoluyla İşlenen Suçlarla Mücadele Edilmesi Hakkında Kanun uyarınca "yer sağlayıcı" sıfatıyla satıcılar ile alıcıları Platform üzerinden buluşturarak satıcıların Platform’dan gerçekleştirdikleri ürün ve/veya hizmet satışlarına ticari temsilci olarak aracılık ettiği modeli ifade eder.
                    </li>
                    <li>
                        <strong>ALICI:</strong> Platform üzerinde üçüncü kişi satıcılar tarafından verilen ilanlarla satışa arz edilen mal ve/veya hizmetleri satın alan gerçek veya tüzel kişi Üye’yi ifade eder.
                    </li>
                    <li>
                        <strong>KİŞİSEL VERİ:</strong>6698 sayılı Kişisel Verilerin Korunması Kanunu’nda tanımlanan kimliği belirli veya belirlenebilir kılan gerçek kişiye ilişkin her türlü bilgi ifade eder.
                    </li>
                    <li>
                        <strong>Kişisel Verilerin Korunmasına İlişkin Aydınlatma Metni:</strong> Üyeler’in Platform üzerinden ilettikleri kişisel verilerin, Sanayice tarafından hangi amaçlarla ve ne şekilde kullanılacağına ilişkin açıklamaları içeren ve Platform üzerinden erişilebilecek olan metni ifade eder.
                    </li>
                    <li>
                        <strong>Hesabım Sayfası / Menü Sayfası:</strong> Üye’nin Platform ve Platform Hizmetleri’nden faydalanmak üzere gerekli işlemleri gerçekleştirdiği, gerekli bilgileri eklediği, gerekli bilgilendirmelerin Üye’ye yapılabileceği, sadece ilgili Üye tarafından belirlenen kullanıcı adı ve şifre ile erişilebilen Üye’ye özel sayfayı ifade eder.
                    </li>
                    <li>
                        <strong>Satıcı/Satıcılar:</strong> Sanayice ile yaptığı Satıcı İşortaklığı ve üyelik sözleşmesi kapsamında Platform’da oluşturduğu hesap üzerinden çeşitli mal ve/veya hizmetleri satışa arz eden tüzel/gerçek kişi Üye’yi ifade eder.
                    </li>
                </ul>
            ),
        },
        {
            id: 'hak-ve-yukumlulukler',
            title: 'TARAFLARIN HAK VE YÜKÜMLÜLÜKLERİ',
            icon: <FaUsers className="w-5 h-5" />,
            content: (
                <ol className="list-decimal list-inside space-y-4 text-gray-700 ml-4">
                    <li className="font-semibold">
                        <span className="font-normal">Üye olmak isteyen kullanıcı 18 (on sekiz) yaşını doldurmuş, Sanayice tarafından belirlenecek diğer şartları sağlamış ve ilgili mevzuat hükümlerine göre gerekli şartları karşılıyor olması gerekmektedir. Bu şartları sağlayan Üye işbu sözleşmeyi onaylaması, Platformda kendisinden talep edilen bilgileri doğru, güncel ve eksiksiz şekilde doldurması ve üyelik başvurusunun Sanayice tarafından onaylanması ile Üyelik sıfatını kazanacaktır. Üyelik sıfatını kazanan üye Platform üzerinden oluşturacağı kendine özel kullanıcı adı ve şifresi ile hesabını oluşturacak ve internet sitesi, mobil uygulama üzerinden sunulan hizmetlerden faydalanabilecektir. Üye, Platform’a eklenecek yeni mecralara veya ek uygulama ve panellere gerektirilen ek şartları sağlamak sureti ile aynı kullanıcı adı ve şifresini kullanarak başka bir hesap açmadan katılabilecek ve hizmetlerden faydalanabilecektir. Üye, bilgilerinde değişiklik olması halinde, derhal bilgilerini güncelleyecektir. Üye, işbu güncelleme işlemlerini çağrı merkezi aracılığıyla veya Platform üzerinden ya da Sanayice tarafından sunulan diğer imkanlar vasıtasıyla güncelleyebilecektir. Üyeye ait bilgilerin doğru, güncel, eksiksiz olmasından ve bu sebeplerle doğacak olan zararlardan üye bizzat sorumlu olmakta, Sanayice’nin bu durumlarda üyeliğini kısmen veya tamamen kısıtlama, engelleme, askıya alma veya sona erdirme hak ve yetkisine sahip olduğunu kabul, beyan ve taahhüt etmektedir. Üyelik hesabı kişiye özeldir, oluşturan kişi dışında üçüncü şahıslara kullandırılamaz, devredilemez aksi durumlarda hukuki ve cezai tüm sorumluluğun üyeliği oluşturan şahsa ait olduğu kabul edilmektedir.</span>
                    </li>
                    <li className="font-semibold">
                        <span className="font-normal">İş bu sözleşme çerçevesinde Sanayice, 6563 sayılı Elektronik Ticaretin Düzenlenmesi Hakkında Kanun uyarınca "elektronik ticaret aracı hizmet sağlayıcı" ve 5651 sayılı İnternet Ortamında Yapılan Yayınların Düzenlenmesi ve Bu Yayınlar Yoluyla İşlenen Suçlarla Mücadele Edilmesi Hakkında Kanun uyarınca "yer sağlayıcı" konumunda bulunmaktadır. Sanayice, bizzat kendisinin satışa sunduğu ürünler haricinde, Platform’da yer alan hiçbir görsel, yazılı veya sair nitelikteki içeriğin gerçekliğinden, güvenilirliğinden, doğruluğundan ya da hukuka uygunluğundan sorumlu değildir ve Sanayice’nin söz konusu içerikleri kontrol etme veya Platform’da hukuka aykırı bir faaliyetin söz konusu olup olmadığını araştırma yükümlülüğü bulunmamaktadır.</span>
                    </li>
                    <li className="font-semibold">
                        <span className="font-normal">Sanayice, Sanayice’nin kendisi tarafından satışa sunulan mal ve hizmetler istisna olmak üzere Üyelerin (Alıcılar), Satıcı, Satıcılar ile aralarında akdedilen mesafeli satış sözleşmesinin tarafı olmamaktadır. Üye, mesafeli satış sözleşmesi kapsamında kendisine karşı yalnızca Satıcı’nın sorumluluğu bulunduğunu, Sanayice’nin herhangi bir nam altında sorumluluğu bulunmadığını kabul, beyan ve taahhüt eder. Satıcılar, bunlarla sınırlı olmamak üzere Platform’da sergiledikleri ve sattıkları tüm ürünlerin kalitesinden, mevzuata uygusnluğundan, zamanında ve ayıpsız şekilde teslim edilmesinden, faturalandırılmasından, garanti belgesi de dahil olmak üzere gerekli tüm belgelerin tesliminden, satış sonrası servislerin ve sair hizmetlerin sunulmasından, diğer tüm yükümlülüklerin yerine getirilmesinden ve sair hususlardaki tüm talep ve şikayetlerden bizzat sorumludur. Ayrıca, Üye, Platform, Platform aracılığıyla sunulan hizmetler ve/veya Platform dahilinde yürütülen faaliyetler ile ilgili olarak herhangi bir hukuki işlem başlatmak istemesi halinde, Platform’da yer alanlar da dahil olmak üzere tüm gerekli yasal yükümlülükler ve prosedürleri bizzat yerine getirmek zorunda olduğunu, bu yükümlülükler ve prosedürlerle ilgili olarak Sanayice’nin herhangi bir bilgisinin ve sorumluluğunun bulunmadığını kabul, beyan ve taahhüt eder.</span>
                    </li>
                    <li className="font-semibold">
                        <span className="font-normal"> Üye kullanıcı adı ve şifre bilgilerinin güvenliği ve gizliliğinden münhasıran sorumlu olacaktır. Kendisine ait kullanıcı adı ve şifre ile gerçekleştirilen işlemlerin kendisi tarafından gerçekleştirilmiş olduğu, bu işlemlerden doğan sorumluluğun münhasıran kendisine ait olduğunu, bu şekilde gerçekleştirilen iş ve işlemlerden kendisinin gerçekleştirmediği yönünde def’i ve itirazının olmayacağını ve bu sebeple Sanayice’ye karşı herhangi bir talepte bulunmayacağını kabul beyan ve taahhüt eder. Üye, bu bilgilerin üçüncü kişilerce ele geçirilmesinden doğabilecek zararlar da dahil olmak üzere hiçbir sorumluluğun Sanayice’ye yüklenmeyeceğini, herhangi bir talepte bulunmayacağını kabul, beyan ve taahhüt eder. Şifre kullanımına ve/veya üyelik hesabı ve şifresinin güvenliğine ilişkin bir şüphenin varlığı halinde, Sanayice, her türlü talep, dava ve takip hakları saklı kalmak üzere, Üye’nin üyeliğini kısmen veya tamamen kısıtlama, engelleme, askıya alma veya sona erdirme hak ve yetkisine sahiptir.</span>
                    </li>
                    <li className="font-semibold">
                        <span className="font-normal">Sanayice, Satıcı ile arasındaki sözleşme gereğince Üyelerden ürün bedelini tahsil etmeye yetkilidir. Üye tarafından Sanayice’ye yapılan ürün bedeli ödemesi ile Üye’nin Satıcı’ya karşı olan ödeme yükümlülüğü sona erecektir. Satıcı’ya yapılan mükerrer ödemeden Alıcı sorumludur.</span>
                    </li>
                    <li className="font-semibold">
                        <span className="font-normal">Üye, Platform’da gerçekleştirdiği her türlü iş ve işlemde, işbu Sözleşme'nin hükümlerine, Sanayice’nin sözleşme ile veya ayrıca platform üzerinden bildirdiği Platform kurallarına, yürürlükteki mevzuat gerekliliklerine, ahlak ve kamu düzeni kurallarına uygun olarak hareket edeceğini kamu düzenini bozucu, genel ahlaka aykırı, başkalarını rahatsız ve taciz edici şekilde, yasalara aykırı bir amaç için, başkalarının fikri ve telif haklarına tecavüz edecek şekilde kullanmayacağını kabul, beyan ve taahhüt eder. Ayrıca, üye başkalarının hizmetleri kullanmasını önleyici veya zorlaştırıcı faaliyet (spam, virus, truva atı, vb.) ve işlemlerde bulunamaz.ve bu iş ve işlemlere ilişkin hukuki ve cezai sorumluluğun bizzat kendisine ait olduğunu kabul beyan ve taahhüt eder.</span>
                    </li>
                    <li className="font-semibold">
                        <span className="font-normal">Sanayice’ye ait platform, internet sitesi, uygulama ve diğer eklenebilecek sanal ortamlarda üyeler tarafından beyan edilen, yazılan, kullanılan fikir ve düşünceler, tamamen üyelerin kendi kişisel görüşleridir ve sadece görüş sahibini bağlar. Bu görüş ve düşüncelerin Sanayice ile hiçbir ilgi ve bağlantısı bulunmamakta, Sanayice’nin üyenin beyan edeceği fikir ve görüşler nedeniyle üçüncü kişilerin uğrayabileceği zararlardan ve üçüncü kişilerin beyan edeceği fikir ve görüşler nedeniyle üyenin uğrayabileceği zararlardan dolayı herhangi bir sorumluluğu bulunmamaktadır.</span>
                    </li>
                    <li className="font-semibold">
                        <span className="font-normal">Üye, diğer internet kullanıcılarının yazılımlarına ve verilerine izinsiz olarak ulaşmamayı veya bunları kullanmamayı kabul eder. Aksi takdirde, bundan doğacak hukuki ve cezai sorumluluklar tamamen üyeye aittir. Üye’nin verilerinin yetkisiz kişilerce okunmasından ve üye yazılım ve verilerine gelebilecek zararlardan dolayı Sanayice sorumlu olmayacaktır. Üye, platformun kullanılmasından dolayı uğrayabileceği herhangi bir zarar yüzünden Sanayice’den tazminat talep etmemeyi peşinen kabul etmiştir.</span>
                    </li>
                    <li className="font-semibold">
                        <span className="font-normal">Sanayice’ye ait internet sitesi, mobil uygulama ve her türlü sanal ortamın yazılım ve tasarımı Sanayice mülkiyetinde olup, bunlara ilişkin telif hakkı ve/veya diğer fikri mülkiyet hakları ilgili kanunlarca korunmakta olup, bunlar  üye tarafından izinsiz kullanılamaz, iktisap edilemez ve değiştirilemez. Bu web sitesinde adı geçen başkaca şirketler ve ürünleri sahiplerinin ticari markalarıdır ve ayrıca fikri mülkiyet hakları kapsamında korunmaktadır.</span>
                    </li>
                    <li className="font-semibold">
                        <span className="font-normal">Sanayice tarafından  platform’un iyileştirilmesi, geliştirilmesine yönelik olarak ve/veya yasal mevzuat çerçevesinde siteye erişmek için kullanılan İnternet servis sağlayıcısının adı ve Internet Protokol (IP) adresi, Siteye erişilen tarih ve saat, sitede bulunulan sırada erişilen sayfalar ve siteye doğrudan bağlanılmasını sağlayan Web sitesinin Internet adresi gibi birtakım bilgiler toplanabilir. Bu bilgilerin toplanmasına üyeler AÇIKÇA RIZA göstermektedirler.</span>
                    </li>
                    <li className="font-semibold">
                        <span className="font-normal">Sanayice kullanıcılarına daha iyi hizmet sunmak, ürünlerini ve hizmetlerini iyileştirmek, sitenin kullanımını kolaylaştırmak için kullanımını kullanıcılarının özel tercihlerine ve ilgi alanlarına yönelik çalışmalarda üyelerin kişisel bilgilerini kullanabilir, üyelerin platform üzerinden yaptığı hareketlerin kaydını bulundurabilir. Bu kayıtların tutulmasına üyeler AÇIKÇA RIZA göstermektedirler.</span>
                    </li>
                    <li className="font-semibold">
                        <span className="font-normal">Sanayice işbu sözleşmenin kurulması ve ifası sırasında elde ettiği kişisel verileri, işbu sözleşmede belirtilen hizmetlerin sunulması, siparişin oluşması ve teslimatın gerçekleşmesi, Üye’nin memnuniyetinin arttırılmasına yönelik faaliyetlerin yürütülmesi, hesaplarının güvenliğinin sağlanması, sahtecilik, dolandırıcılık, Platform’un kötüye kullanımı, Türk Ceza Kanunu anlamında suç oluşturabilecek konularda çıkan uyuşmazlıkların giderilmesi amaçları ve bunlarla sınırlı olmamak üzere gerekli diğer amaçlarla, Üye'nin kişisel verilerini işleme ve paylaşma hakkına ve yetkisine sahiptir. Bu hususlara üyeler tarafından AÇIKÇA RIZA gösterilmektedir.</span>
                    </li>
                    <li className="font-semibold">
                        <span className="font-normal">Üye, kişisel verileri işleme ve paylaşma faaliyetleri hakkında  Platform altında yer alan ve işbu Sözleşme'nin ayrılmaz bir parçası olan Kişisel Verilerin Korunmasına İlişkin Aydınlatma Metni (“Aydınlatma Metni”) ile detaylı bilgi sahibi olabileceğini ve Sanayice’nin Aydınlatma Metnini yürürlükteki mevzuatta veya şirket uygulamalarında yapılabilecek değişiklikler çerçevesinde her zaman güncelleme hakkına sahip olduğunu kabul ve beyan eder.</span>
                    </li>
                    <li className="font-semibold">
                        <span className="font-normal">Üye, işlenmekte olan kişisel verilerine ilişkin ayrıntılı bilgi almak ve KVKK kapsamındaki hak ve taleplerini yöneltmek amacıyla Veri Sorumlusuna Başvuru Usul ve Esasları Hakkında Tebliğ’in 5.maddesinde belirtilen zorunlu unsurları içerecek şekilde, Aydınlatma Metni’nde yer alan başvuru yöntemleriyle veya üyelik hesabında kayıtlı e-posta adresi üzerinden Sanayice’ye ait e-posta adresine e-posta göndererek başvuruda bulunabilir.</span>
                    </li>
                    <li className="font-semibold">
                        <span className="font-normal">Üyelik sözleşmesinin sona ermesi/üyelik hesabının kapatılması ile birlikte işleme ve saklama amacı ortadan kalkan kişisel veriler mevzuata uygun olarak silinecektir. Üye’nin mevzuat uyarınca saklanması zorunlu olan kişisel verilerinin işlenme amacı ortadan kalkana kadar Sanayice tarafından işlenmeye devam edilmesi istisnadır.</span>
                    </li>
                    <li className="font-semibold">
                        <span className="font-normal">Sanayice söz konusu kişisel verilerin KVKK’nın 12.maddesi uyarınca güvenli şekilde saklanması, yetkisiz erişimlerin ve hukuka aykırı veri işlemelerin önlenmesi için gereken her türlü tedbiri alacaktır.</span>
                    </li>
                    <li className="font-semibold">
                        <span className="font-normal">Üye, işlenen Kişisel Verilerinin (vereceği kişisel ve alışveriş bilgileri ve alışveriş ve/veya tüketici davranış bilgileri dahil) yürürlükte bulunan ve/veya yürürlüğe alınacak uygulamalar kapsamında Sanayice ve iştirakleri olan tüm şirketler tarafından  kendisine ürün ve hizmet tanıtımları, reklamlar, kampanyalar, avantajlar, anketler  ve diğer müşteri memnuniyeti uygulamaları sunulması amacı ile kullanımına izin verdiğini beyan ve kabul eder.  Üye, işlenen Kişisel Verilerin (vereceği kişisel ve alışveriş bilgileri ve alışveriş ve/veya tüketici davranış bilgileri dahil)  Sanayice tarafından, satıcılar veya ilgili kuruluşlara (aracı banka, kampanyalar dahilinde ki kurumlar vb) belirtilen amaçlar ile verilebileceğini kabul ve beyan eder.</span>
                    </li>
                    <li className="font-semibold">
                        <span className="font-normal">Üye, satın aldığı ürünlere ilişkin yaptığı yorumların ürünün satın alındığı satıcı tarafından talep edilmesi halinde, mevzuata uygun olarak satıcı ile paylaşılabileceğini ve satıcı tarafından mevzuata uygun olarak işbu yorumların kullanılabileceğini kabul eder.</span>
                    </li>
                    <li className="font-semibold">
                        <span className="font-normal">Üye aksini bildirmediği sürece Sanayice ve iştiraklerinin olan tüm şirketlerin kendisi ile internet, telefon, SMS, vb iletişim kanalları kullanarak irtibata geçmesine izin verdiğini beyan ve kabul eder. Üye yukarıda bahsi geçen bilgilerin toplanması, paylaşılması, kullanılması, arşivlenmesi ve kendisine erişilmesi nedeniyle doğrudan ve/veya dolaylı maddi ve/veya manevi menfi ve/veya müsbet, velhasıl herhangi bir zarara uğradığı konusunda talepte bulunmayacağını ve Sanayice ve iştiraki olan şirketleri sorumlu tutmayacağını beyan ve kabul eder.</span>
                    </li>
                    <li className="font-semibold">
                        <span className="font-normal">Üye, Sanayice’nin herhangi bir suretle bildirdiği/duyurduğu Platform kurallarına uyacağını, üçüncü kişilerin fikri ve sınai mülkiyet haklarına, özel hayatın gizliliği haklarına, kişilik haklarına ve diğer yasal mevzuattan doğan haklarına ve ahlak kurallarına uyacağını, üye içeriklerini Sanayice’nin Platform sistemini manipüle edecek şekilde kullanmayacağını (asılsız şikayet, asılsız yorum ve puanlama vs.), üçüncü kişilere ilişkin KVVK kapsamında kişisel verileri, yorum, video, fotoğraf, ifade, puan, yazışma ve sair tüm içeriklerde ihlal etmeyeceğini kabul, beyan ve taahhüt eder. </span>
                    </li>
                    <li className="font-semibold">
                        <span className="font-normal">Üye, yorum, video, fotoğraf, ifade, puan, yazışma ve sair tüm içeriklerde Konusu suç teşkil eden, uluslararası anlaşmaların ihlali sonucunu doğuran ya da ihlalini teşvik eden, reklam ve/veya pazarlama içerikli, pornografik, çıplaklık içeren ya da toplumca genel kabul görmüş kurallara, fikri ve sınai haklara aykırı, haksız rekabet yaratan ve/veya benzer nitelikte ihlal içermeyeceğini kabul, beyan ve taahhüt eder. Sanayice maddede belirtilen üye içeriklerini kontrol yükümlülüğü bulunmamaktadır. Ancak Sanayice, herhangi bir talep/şikayet veya re’sen yapılan kontroller neticesinde ihlal içeren içerikleri yayınlamayabilir, değiştirebilir, silebilir, erişimi engelleyebilir. Sanayice ayrıca, her türlü talep, dava ve takip hakları saklı kalmak üzere, Üye’nin üyeliğini kısmen veya tamamen kısıtlama, engelleme, askıya alma veya sona erdirme hak ve yetkisine sahiptir.</span>
                    </li>
                    <li className="font-semibold">
                        <span className="font-normal">Sanayice tüm platform’un virus ve benzeri amaçlı yazılımlardan arındırılmış olması için mevcut imkanlar dahilinde tedbirler alacaktır. Ancak güvenliğin sağlanması için kullanıcının da kendi virus koruma sistemini tedarik etmesi ve gerekli korunmayı sağlaması gerekmektedir. Bu bağlamda üye Sanayice’ye ait platformu herhangi bir şekilde kullanmasıyla, kendi yazılım ve işletim sistemlerinde oluşabilecek tüm hata ve bunların doğrudan ya da dolaylı sonuçlarından kendisinin sorumlu olduğunu kabul ve beyan eder.</span>
                    </li>
                    <li className="font-semibold">
                        <span className="font-normal">Sanayice platformun tam ve gereği gibi çalışabilmesi için platformda her türlü değişikliği yapma, güncellemeler ekleme, sunulan hizmetleri ve içerikleri, kullanım koşullarını her zaman ve hiçbir bildirimde bulunmadan değiştirme hakkına ve yetkisine sahiptir. Değiştirilen, güncellenen ya da yürürlükten kaldırılan her hüküm, yayın tarihinden itibaren tüm üyeler bakımından hüküm ifade edecektir.</span>
                    </li>
                    <li className="font-semibold">
                        <span className="font-normal">Sanayice, iş bu üyelik sözleşmesi uyarınca, üyelerinin kendisinde kayıtlı elektronik posta adreslerine bilgilendirme mailleri ve cep telefonlarına bilgilendirme SMS’leri gönderme yetkisine sahiptir. Üye de bu bilgilendirme mail ve SMS’lerinin kendine ait bildirdiği mail ve telefon numarasına gönderilmesine AÇIKÇA RIZA göstermektedir. Mail ve SMS bildirim tercihlerini değiştirmek isteyen üyeler platform üzerinden kendilerine sağlanan “hesabım” sayfasından tercihlerini değiştirebileceklerdir.</span>
                    </li>
                    <li className="font-semibold">
                        <span className="font-normal">Platform’da yer alan linkler, aracılığı ile Üye farklı bir site veya uygulamalara yönlendirilir ise Sanayice bu web sitelerinin/uygulamaların içeriği, doğruluğu, güvenilirliği, güvenliği ve/veya işlevselliği ile ilgili olarak herhangi bir garanti ve taahhüt vermemektedir. Sanayice, bu web siteleri/uygulamalar bakımından erişimden, kullanımdan, indirmelerden, paylaşımlardan ve/veya değişikliklerden doğabilecek zararlara ilişkin herhangi bir yükümlülüğü bulunmamaktadır.</span>
                    </li>
                    <li className="font-semibold">
                        <span className="font-normal">Üye, herhangi bir sebep göstermeksizin tek taraflı olarak her zaman üyeliğini sona erdirebilecektir. Üye, üyelik hesabının kapatılması sürecini Platform üzerinden gerçekleştirebilecektir. Üyenin hesap kapama işlemlerine başlaması ile Sanayice hesap güvenliğinin sağlanması ve suistimalin önlenmesi amaçlarıyla gerekli prosedürleri işleterek hesap kapama işlemini gerçekleştir.</span>
                    </li>
                    <li className="font-semibold">
                        <span className="font-normal">Sanayice tamamen kendi inisiyatifinde olmak üzere Platform’u ve/veya Platform aracılığıyla sunulan  hizmetleri, kısmen veya tamamen, sürekli veya geçici olarak yayından kaldırabilir, değiştirebilir, ücretli hale getirebilir, güncelleyebilir, askıya alabilir, durdurabilir ve/veya Platform üzerinde ilave hizmetler açabilir. Üye bu madde de belirtilen hak ve yetkileri açıkça anladığını ve rıza gösterdiğini kabul eder. </span>
                    </li>
                    <li className="font-semibold">
                        <span className="font-normal">İş bu sözleşmenin uygulanmasında, yorumlanmasında, doğacak ihtilaflarda Türk hukuku uygulanacaktır. Bu sözleşmeden doğacak ihtilafların çözümünde İstanbul Bakırköy mahkemeleri ve icra daireleri yetkilidir.</span>
                    </li>
                    <li className="font-semibold">
                        <span className="font-normal">ÜYE, sözleşmenin uygulanmasından doğacak her türlü ihtilafta, Sanayice tarafından tutulan belge ve kayıtların geçerli, bağlayıcı ve kesin delil teşkil ettiğini, bu maddenin 6100 sayılı Hukuk Muhakemeleri Kanunu 193. Maddesi uyarınca kesin delil sözleşmesi olduğunu kabul, beyan ve taahhüt eder.</span>
                    </li>
                    <li className="font-semibold">
                        <span className="font-normal">Taraflar, İşbu sözleşmenin herhangi bir hükmünün veya herhangi bir ifadesinin geçersiz kılınması, hukuka aykırı olması veya uygulanamaz nitelik içermesi halinde sözleşmenin geçerliliğini koruyacağı, diğer hükümlerinin aynı şartlarda geçerli olacağını ve sözleşmeden dönme/fesih için haklı sebep oluşturmayacağını kabul, beyan ve taahhüt ederler.</span>
                    </li>
                </ol>
            ),
        },
        {
            id: 'mucbir-sebepler',
            title: '4. MÜCBİR SEBEPLER',
            icon: <FaShieldAlt className="w-5 h-5" />,
            content: (
                <ol className="list-decimal list-inside space-y-4 text-gray-700 ml-4">
                    <li className="font-semibold">
                        <span className="font-normal">Hukuken mücbir sebep sayılan (doğal afet, savaş, grev, isyan, iletişim sorunları, altyapı ve internet arızaları, sisteme ilişkin yenileme ve geliştirme çalışmaları ve bunlardan doğan aksaklıklar, elektrik kesintisi, yasal sınırlamalar, kötü hava koşulları, internet kesintisi dahil ve sınırlı olmamak üzere önlenemeyecek kaçınılmaz benzeri olaylar) tüm durumlarda, Sanayice iş bu sözleşme ile belirtilen edimlerini kesintisiz devam ettireceğini taahhüt etmemektedir. Taraflarca mücbir sebep hallerinde Sanayice’nin edimlerinden herhangi birini geç veya eksik ifa etme veya ifa edememe durumunun olabileceği, bu durumlarda Üyelerin Sanayice’den temerrüt, eksik ayıplı ifa veya herhangi bir nam altında tazminat talep etme hakkı doğurmayacağı konusunda anlaşmış, mutabık kalmışlardır. </span>
                    </li>
                </ol>
            ),
        },
        {
            id: 'sozlesme-degisiklikleri',
            title: '5. SÖZLEŞME DEĞİŞİKLİKLERİ',
            icon: <FaInfoCircle className="w-5 h-5" />,
            content: (
                <p className="text-gray-700">
                    Sanayice işbu sözleşmeye ilişkin herhangi bir madde de değişiklik yapma hak ve yetkisine sahiptir. Bu değişikliklere ilişkin bildirim ÜYE’ye ait elektronik iletişim adresine gönderilecek e-posta ile veya telefon numarasına gönderilecek SMS ile yapılacak ve bildirimin yapıldığı tarihten itibaren yürürlüğe girecektir. Şu kadar ki Üye, bu değişiklikleri kabul etmemesi halinde Sanayice’ye bildirimden itibaren 3 gün içinde yazılı bildirimde bulunmak kaydıyla üyeliğinin sonlandırılması ile sözleşme tarafı olmaktan çıktığı talebini ileterek işbu Sözleşme’yi feshedebilecektir.
                </p>
            ),
        },
        {
            id: 'yururluluk',
            title: '6. YÜRÜRLÜLÜK',
            icon: <FaCheckCircle className="w-5 h-5" />,
            content: (
                <p className="text-gray-700">
                    İş bu sözleşme yürürlük maddesi ile birlikte …. Maddeden ve …. Ekten oluşmaktadır. ÜYE tarafından üyelik kaydı yapılması üyenin üyelik sözleşmesinde yer alan tüm maddeleri okuduğu ve üyelik sözleşmesinde yer alan maddeleri kabul ettiği anlamına gelir. İşbu Sözleşme üyenin üye olması anında akdedilmiş ve karşılıklı olarak yürürlüğe girmiştir.
                    İş bu sözleşmenin ekleri, İlerde bildirimlerle yapılan değişiklikleri, platform üzerinden yapılan açıklamalar, tüm yazılı süreçler ve ek her türlü yazılı, elektronik ortamda bulunan dokümanlar sözleşmenin ayrılmaz birer parçasıdır.
                </p>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-6">

                <div className="relative bg-orange-50 border-b-4 border-orange-600 shadow-lg p-10 mb-8 rounded-2xl text-gray-800">
                    <div className="relative z-10 text-center pt-6">
                        {/* Ana Başlık */}
                        <h1 className="text-xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
                             ÜYELİK SÖZLEŞMESİ
                        </h1>

                        {/* Yürürlük Tarihi */}
                        <div className="flex items-center justify-center text-sm font-medium text-gray-500 mt-4">
                            <FaCalendarAlt className="w-4 h-4 mr-2 text-orange-600" />
                            <span>Yürürlük Tarihi: 20 Ekim 2025</span>
                        </div>
                    </div>

                    {/* Firma Adresi Bilgisi (Daha Pasif) */}
                    <div className="text-xs text-center text-gray-400 mt-6 pt-4 border-t border-gray-100">
                        Fenerbahçe Mah. İğrip Sk. No: 13 İç Kapı No: 1 Kadıköy/İstanbul
                    </div>
                </div>

                {/* Quick Navigation */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <FaListOl className="w-5 h-5 mr-2 text-orange-600" />
                        Sözleşme Başlıkları
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {sections.map((section) => (
                            <a
                                key={section.id}
                                href={`#${section.id}`}
                                className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                            >
                                <span className="text-orange-600 mr-3">{section.icon}</span>
                                <span className="text-gray-700 group-hover:text-orange-600 font-medium text-sm md:text-base">{section.title}</span>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="space-y-8">
                    {sections.map((section) => (
                        <div key={section.id} id={section.id} className="bg-white rounded-lg shadow-md border border-gray-200 md:p-8 p-4 ">
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mr-4">
                                    {section.icon}
                                </div>
                                <div>
                                    <h2 className="text-lg md:text-2xl font-bold text-gray-800">{section.title}</h2>
                                </div>
                            </div>

                            <div className="prose max-w-none text-gray-700 leading-relaxed text-justify">
                                {section.content}
                            </div>
                        </div>
                    ))}
                </div>

               <div className="bg-blue-50 border-l-4 border-blue-500 p-8 mt-12 rounded-lg shadow-lg">
    <div className="flex items-start">
        <FaCheckCircle className="w-7 h-7 text-blue-600 mr-4 mt-1 flex-shrink-0" />
        <div>
            <h3 className="text-xl font-bold text-blue-800 mb-3">Sözleşme Onayı ve Yürürlük Bilgisi</h3>
            <p className="text-blue-700 leading-relaxed">
                Platform'da gerçekleştireceğiniz üyelik işlemi, bu belgenin tüm maddelerini, hak ve yükümlülüklerini okuduğunuzu ve onayladığınızı beyan ve taahhüt etmeniz demektir. Onayınız ile birlikte sözleşme yürürlüğe girer ve Taraflar için hukuki sonuçlar doğurur.
            </p>
          
        </div>
    </div>
</div>
            </div>
        </div>
    );
};

export default MembershipAgreement;