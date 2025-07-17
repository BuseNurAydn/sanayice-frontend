import { useState } from 'react';
import { FaApple, FaFacebook } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import AuthLayout from '../AuthLayout';
import { BsTelephone } from 'react-icons/bs';
import { CiMail } from 'react-icons/ci';
import Input from '../../../shared/Input/Input';
import OrangeButton from '../../../shared/Button/OrangeButton';
import GrayButton from '../../../shared/Button/GrayButton';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../../store/authSlice';
import { login } from '../../../services/authService';


const Login = () => {
    const [isAgreementAccepted, setIsAgreementAccepted] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [isPhoneLogin, setIsPhoneLogin] = useState(false);
    const openModal = () => setIsModalOpen(true);   
    const closeModal = () => setIsModalOpen(false);
        const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLoginData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setErrors((prev) => ({ ...prev, [name]: '' })); // Hata temizle
        setSuccessMessage('');
    };

    const toggleLoginMethod = () => setIsPhoneLogin((prev) => !prev);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!isAgreementAccepted) {
            setErrors({ general: 'Üyelik sözleşmesini kabul etmeniz gerekmektedir.' });
            return;
        }

        try {
            
            const data = await login(loginData);

            // Giriş başarılı mesajı
            setSuccessMessage('Giriş başarılı! Yönlendiriliyorsunuz...');
            setErrors({});

            // Kullanıcı ve token bilgilerini redux toolkite'e kaydettim
            dispatch(setCredentials({
                user: {
                    id: data.id,
                    email: data.email,
                    name: data.name,
                    role: data.roles[0]  // <--- ilk rolü kullanıyoruz
                },
                token: data.token,
            }));

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({
                id: data.id,
                email: data.email,
                name: data.name,
                role: data.roles[0],
            }));

            setTimeout(() => {
                //Role göre yönlendirme
                if (data.roles[0] == 'ROLE_SELLER') {
                    navigate('/seller/vertification');
                } else if (data.roles[0] == 'ROLE_CUSTOMER') {
                    navigate('/');
                }
                else {
                    navigate('/seller/categories')
                }
            }, 1500); // 1.5 saniye bekleyip yönlendir

        } catch (error) {
            if (error.errors) {
                setErrors(error.errors);
            } else {
                setErrors({ general: error.message || 'Giriş başarısız!' });
            }
        }
    };
    const renderEmailLogin = () => (
        <>

            {/* Genel Hata Mesajı */}
            {errors.general && (
                <div className="text-red-500 text-sm mb-2">{errors.general}</div>
            )}

            {/* Başarı mesajı */}
            {successMessage && (
                <div className="text-green-600 text-sm mb-2">{successMessage}</div>
            )}

            {/* E-Posta Girişi */}
            <Input type="email" placeholder="E-posta adresi" name="email" value={loginData.email} onChange={handleInputChange} />
            {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}

            <Input type="password" placeholder="Şifre" className="mt-4" name="password" value={loginData.password}
                onChange={handleInputChange} />
            {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}

            <a href="/forgot-password" className="custom-font font-medium text-[var(--color-light-orange)]">
                Şifremi Unuttum
            </a>
            <div className="flex items-start space-x-2 mt-4">
                <input
                    type="checkbox"
                    id="agreement"
                    checked={isAgreementAccepted}
                    onChange={(e) => setIsAgreementAccepted(e.target.checked)}
                    className="mt-1"
                />
                <label htmlFor="agreement" className="text-sm text-gray-700 leading-5">
                    <span 
                        className="text-[var(--color-light-orange)] cursor-pointer hover:underline"
                        onClick={openModal}
                    >
                        Üyelik Sözleşmesini
                    </span> okudum, anladım ve kabul ediyorum.
                </label>
            </div>

            <OrangeButton type="submit" onClick={handleLogin}> Giriş Yap </OrangeButton>

           {/** <GrayButton type="button" onClick={toggleLoginMethod}>
                <BsTelephone className="w-5 h-5" />
                Telefon Numarası ile Giriş Yap
            </GrayButton>*/} 
        </>
    );

   {/* const renderPhoneLogin = () => (
        <>
            Telefon Girişi
            <Input type="tel" placeholder="Telefon Numarası" />

            <OrangeButton type="submit"> Giriş Yap </OrangeButton>

            <GrayButton type="button" onClick={toggleLoginMethod}>
                <CiMail className="w-5 h-5" />
                E-posta ile Giriş Yap
            </GrayButton>
        </>
    );

    const SocialLogin = () => (
        <div className="mt-6 flex flex-col items-center space-y-4 bg-gray-100 p-4">
            <span className="text-sm text-gray-600">Sosyal hesabın ile giriş yap</span>
            <div className="flex items-center justify-center space-x-4">
                {[<FaApple />, <FcGoogle />, <FaFacebook />].map((Icon, index) => (
                    <div key={index} className="p-2 border border-gray-300 rounded-lg">
                        {Icon}
                    </div>
                ))}
            </div>
        </div>
    );*/}
    return (
        <AuthLayout>
          <form className="space-y-6 flex flex-col p-4 mt-8">
            {renderEmailLogin()}
            {/*{isPhoneLogin ? renderPhoneLogin() : renderEmailLogin()}*/}
      
            {/** <SocialLogin />*/}
      
            <div className="text-center text-xs text-green-600">
              Güvenli alışveriş
            </div>
          </form>
      
          {/* Üyelik Sözleşmesi Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-transparent backdrop-filter backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white bg-opacity-25 rounded-2xl shadow-xl w-full max-w-3xl max-h-[80vh] overflow-hidden">
            
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b">
                  <h2 className="text-2xl font-semibold">Üyelik Sözleşmesi</h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-800 text-3xl leading-none"
                  >
                    &times;
                  </button>
                </div>
      
                {/* Content */}
                <div className="px-6 py-4 overflow-y-auto space-y-6 text-sm leading-relaxed">
                  <h3 className="font-bold text-lg">KULLANICI ÜYELİK SÖZLEŞMESİ</h3>
                  
                  <section className="space-y-3">
                    <h4 className="font-semibold">TARAFLAR</h4>
                    <p>
                      İşbu Satıcı Kullanıcı Üyelik Sözleşmesi ("Sözleşme"), bir tarafta
                      FENERBAHÇE MAH. İĞRİP SK. NO: 13 İÇ KAPI NO: 1 KADIKÖY/
                      İSTANBUL adresinde bulunan ŞAHIS ŞİRKETİMİZ (“Sanayice”) ile
                      diğer tarafta kullanıcı (Üye/Üyeler) arasında aşağıda belirtilen
                      şartlar ve hükümler dâhilinde sözleşmenin Üye/Üyeler tarafından
                      mobil uygulama ve/veya internet sitesi üzerinden Sanayice’nin
                      sunmuş olduğu işbu sözleşmeyi onaylayarak ve/veya Platformu
                      indirip kullanarak ve/veya Platform üzerinden işlem yaptığı anda
                      yürürlüğe girmiştir.
                    </p>
                    <p>
                      İş bu sözleşme kapsamında Sanayice ve Üye ayrı ayrı "Taraf",
                      birlikte "Taraflar" olarak anılacaktır. İşbu Sözleşme’nin ekleri
                      ve Sanayice tarafından sunulan hizmetlerinin kullanımına ilişkin
                      tüm yazılı süreçler, açıklamalar ile ek diğer tüm dokümanlar
                      Sözleşme’nin ayrılmaz birer parçası kabul edilecektir.
                    </p>
                  </section>
                  
                  <section className="space-y-3">
                    <h4 className="font-semibold">TANIMLAR</h4>
                    <p>
                      <strong>PAZARYERİ:</strong> Sanayice’nin 6563 sayılı Elektronik
                      Ticaretin Düzenlenmesi Hakkında Kanun uyarınca "elektronik
                      ticaret aracı hizmet sağlayıcı" ve 5651 sayılı İnternet Ortamında
                      Yapılan Yayınların Düzenlenmesi … modelini ifade eder.
                    </p>
                    <p>
                      <strong>ALICI:</strong> Platform üzerinde üçüncü kişi satıcılar
                      tarafından verilen ilanlarla satışa arz edilen mal ve/veya
                      hizmetleri satın alan gerçek veya tüzel kişi Üye’yi ifade eder.
                    </p>
                    <p>
                      <strong>KİŞİSEL VERİ:</strong> 6698 sayılı Kişisel Verilerin
                      Korunması Kanunu’nda tanımlanan kimliği belirli veya
                      belirlenebilir kılan gerçek kişiye ilişkin her türlü bilgi
                      ifade eder.
                    </p>
                    {/* … diğer tanımlar buraya eklenebilir */}
                  </section>
      
                  {/* … daha fazla madde */}
                </div>
      
                {/* Footer */}
                <div className="px-6 py-4 border-t flex justify-end">
                  <button
                    onClick={closeModal}
                    className="px-5 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition"
                  >
                    Kapat
                  </button>
                </div>
              </div>
            </div>
          )}
        </AuthLayout>
      );   
};
export default Login;
