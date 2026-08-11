import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageWrapper from "@/components/PageWrapper";
import { MapPin, Mail, Phone, Globe } from "lucide-react";
import Seo from "@/components/Seo";

const AvisoLegalContent = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Seo
        title="Aviso Legal"
        description="Datos identificativos, condiciones de uso y política de privacidad de Frontier Residences Real Estate Management S.L."
        path="/aviso-legal"
      />
      <Navigation />
      <main className="flex-1 pt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-primary mb-6">
              Aviso Legal
            </h1>
            <p className="text-foreground/70 mb-12">
              Última actualización: Agosto de 2026.
            </p>

            <section className="mb-12">
              <h2 className="font-playfair text-2xl font-semibold text-primary mb-4">
                1. Información del titular
              </h2>
              <div className="prose prose-lg max-w-none text-foreground/80 leading-relaxed">
                <p>
                  En cumplimiento de lo dispuesto en la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa a los usuarios del presente sitio web de los siguientes datos identificativos:
                </p>
                <ul className="list-none space-y-2 mt-4">
                  <li><strong>Titular:</strong> Frontier Residences Real Estate Management S.L.</li>
                  <li><strong>CIF:</strong> ESB70848841</li>
                  <li><strong>Domicilio social:</strong> Calle Fresnos de Guadalmar, 15, 29004 Málaga, España</li>
                  <li><strong>Correo electrónico:</strong> hello@frontier-residences.com</li>
                  <li><strong>Teléfono:</strong> +34 649 429 678</li>
                  <li><strong>Sitio web:</strong> https://frontier-residences.com</li>
                </ul>
                <p className="mt-4">
                  Inscrita en el Registro Mercantil de Málaga, Tomo 6480, Folio 59, Hoja MA-180653, Inscripción 1.
                </p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="font-playfair text-2xl font-semibold text-primary mb-4">
                2. Objeto
              </h2>
              <div className="prose prose-lg max-w-none text-foreground/80 leading-relaxed">
                <p>
                  El presente sitio web tiene por objeto proporcionar información sobre Frontier Residences Real Estate Management S.L. y los servicios profesionales que ofrece en el sector inmobiliario y de la gestión de propiedades en la Costa del Sol.
                </p>
                <p>Entre nuestros servicios se incluyen, entre otros:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Gestión integral de alquileres vacacionales.</li>
                  <li>Gestión de alquileres de media y larga estancia.</li>
                  <li>Administración integral de propiedades.</li>
                  <li>Revenue Management y optimización de rentabilidad.</li>
                  <li>Comercialización y marketing inmobiliario.</li>
                  <li>Consultoría inmobiliaria.</li>
                  <li>Coordinación de mantenimiento y reformas.</li>
                  <li>Servicios de concierge para propietarios e invitados.</li>
                  <li>Asesoramiento para la adquisición, explotación y puesta en valor de activos inmobiliarios.</li>
                </ul>
                <p className="mt-4">
                  Toda la información contenida en este sitio web tiene carácter meramente informativo y podrá ser modificada o actualizada sin previo aviso.
                </p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="font-playfair text-2xl font-semibold text-primary mb-4">
                3. Condiciones de uso
              </h2>
              <div className="prose prose-lg max-w-none text-foreground/80 leading-relaxed">
                <p>
                  El acceso y utilización del presente sitio web atribuye la condición de usuario e implica la aceptación plena y sin reservas de las presentes condiciones.
                </p>
                <p>
                  El usuario se compromete a utilizar el sitio web de conformidad con la legislación vigente, la buena fe, el orden público y las presentes condiciones, absteniéndose de realizar cualquier actuación que pueda perjudicar el funcionamiento del sitio web o vulnerar los derechos e intereses de Frontier Residences Real Estate Management S.L. o de terceros.
                </p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="font-playfair text-2xl font-semibold text-primary mb-4">
                4. Propiedad intelectual e industrial
              </h2>
              <div className="prose prose-lg max-w-none text-foreground/80 leading-relaxed">
                <p>
                  Todos los contenidos del sitio web, incluyendo, entre otros, textos, imágenes, fotografías, vídeos, logotipos, marcas, nombres comerciales, diseños, gráficos, software, código fuente y cualquier otro elemento, son propiedad de Frontier Residences Real Estate Management S.L. o de sus respectivos titulares y están protegidos por la legislación española e internacional en materia de propiedad intelectual e industrial.
                </p>
                <p>
                  Queda prohibida la reproducción, distribución, comunicación pública, transformación o cualquier otra forma de explotación de dichos contenidos sin la autorización previa y por escrito de Frontier Residences Real Estate Management S.L.
                </p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="font-playfair text-2xl font-semibold text-primary mb-4">
                5. Responsabilidad
              </h2>
              <div className="prose prose-lg max-w-none text-foreground/80 leading-relaxed">
                <p>
                  Frontier Residences Real Estate Management S.L. realiza todos los esfuerzos razonables para garantizar que la información publicada en este sitio web sea correcta, completa y esté actualizada.
                </p>
                <p>
                  No obstante, no garantiza la disponibilidad permanente del sitio web ni la inexistencia de errores u omisiones.
                </p>
                <p>La empresa no será responsable de los daños o perjuicios derivados de:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Interrupciones del servicio.</li>
                  <li>Errores técnicos o informáticos.</li>
                  <li>Ataques informáticos o virus.</li>
                  <li>Fallos en redes de telecomunicaciones.</li>
                  <li>Decisiones adoptadas por el usuario basadas en la información publicada en este sitio web.</li>
                </ul>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="font-playfair text-2xl font-semibold text-primary mb-4">
                6. Enlaces externos
              </h2>
              <div className="prose prose-lg max-w-none text-foreground/80 leading-relaxed">
                <p>
                  Este sitio web puede contener enlaces a páginas web de terceros.
                </p>
                <p>
                  Frontier Residences Real Estate Management S.L. no controla dichos sitios web y no asume responsabilidad alguna sobre sus contenidos, disponibilidad, condiciones de uso o políticas de privacidad.
                </p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="font-playfair text-2xl font-semibold text-primary mb-4">
                7. Protección de datos
              </h2>
              <div className="prose prose-lg max-w-none text-foreground/80 leading-relaxed">
                <p>
                  Los datos personales facilitados a través del presente sitio web serán tratados de conformidad con el Reglamento (UE) 2016/679 (Reglamento General de Protección de Datos – RGPD), la Ley Orgánica 3/2018 de Protección de Datos Personales y Garantía de los Derechos Digitales (LOPDGDD) y demás normativa aplicable.
                </p>
                <p>
                  Puede consultar información detallada sobre el tratamiento de sus datos personales en nuestra Política de Privacidad.
                </p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="font-playfair text-2xl font-semibold text-primary mb-4">
                8. Política de Cookies
              </h2>
              <div className="prose prose-lg max-w-none text-foreground/80 leading-relaxed">
                <p>
                  Este sitio web utiliza cookies propias y de terceros para garantizar el correcto funcionamiento del sitio web, analizar el tráfico, mejorar la experiencia del usuario y ofrecer contenidos personalizados.
                </p>
                <p>
                  Para obtener información detallada sobre el uso de cookies y la configuración de sus preferencias, consulte nuestra Política de Cookies.
                </p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="font-playfair text-2xl font-semibold text-primary mb-4">
                9. Legislación aplicable y jurisdicción
              </h2>
              <div className="prose prose-lg max-w-none text-foreground/80 leading-relaxed">
                <p>
                  El presente Aviso Legal se rige por la legislación española.
                </p>
                <p>
                  Cualquier controversia derivada del acceso o utilización del presente sitio web se someterá a los Juzgados y Tribunales de Málaga, salvo que la normativa aplicable establezca un fuero distinto de carácter imperativo.
                </p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="font-playfair text-2xl font-semibold text-primary mb-6">
                10. Contacto
              </h2>
              <div className="prose prose-lg max-w-none text-foreground/80 leading-relaxed mb-6">
                <p>
                  Para cualquier consulta relacionada con este Aviso Legal o con los servicios prestados por Frontier Residences Real Estate Management S.L., puede ponerse en contacto con nosotros a través de los siguientes medios:
                </p>
              </div>
              <div className="bg-secondary/30 rounded-lg p-6 space-y-4">
                <p className="font-semibold text-primary">Frontier Residences Real Estate Management S.L.</p>
                <div className="flex items-start gap-3 text-foreground/80">
                  <MapPin className="w-5 h-5 mt-0.5 shrink-0" />
                  <span>Calle Fresnos de Guadalmar, 15<br />29004 Málaga, España</span>
                </div>
                <div className="flex items-center gap-3 text-foreground/80">
                  <Mail className="w-5 h-5 shrink-0" />
                  <span>hello@frontier-residences.com</span>
                </div>
                <div className="flex items-center gap-3 text-foreground/80">
                  <Phone className="w-5 h-5 shrink-0" />
                  <span>+34 649 429 678</span>
                </div>
                <div className="flex items-center gap-3 text-foreground/80">
                  <Globe className="w-5 h-5 shrink-0" />
                  <span>https://frontier-residences.com</span>
                </div>
              </div>
            </section>

            <p className="text-sm text-foreground/60 pt-8 border-t border-border">
              Última actualización: Agosto de 2026.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const AvisoLegal = () => (
  <PageWrapper slug="site--aviso-legal">
    <AvisoLegalContent />
  </PageWrapper>
);

export default AvisoLegal;
